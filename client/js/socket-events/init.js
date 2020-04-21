"use strict";

import socket from "../socket";
import storage from "../localStorage";
import {router, switchToChannel, navigate, initialize as routerInitialize} from "../router";
import store from "../store";
import parseIrcUri from "../helpers/parseIrcUri";

socket.on("init", function (data) {
	store.commit("networks", mergeNetworkData(data.networks));
	store.commit("isConnected", true);
	store.commit("currentUserVisibleError", null);

	if (data.token) {
		storage.set("token", data.token);
	}

	if (!store.state.appLoaded) {
		// Routes are initialized after networks data is merged
		// so the route guard for channels works correctly on page load
		routerInitialize();

		store.commit("appLoaded");

		socket.emit("setting:get");

		if (window.g_TheLoungeRemoveLoading) {
			window.g_TheLoungeRemoveLoading();
		}

		// TODO: Review this code and make it better
		if (!router.currentRoute.name || router.currentRoute.name === "SignIn") {
			const channel = store.getters.findChannel(data.active);

			if (channel) {
				switchToChannel(channel.channel);
			} else if (store.state.networks.length > 0) {
				// Server is telling us to open a channel that does not exist
				// For example, it can be unset if you first open the page after server start
				switchToChannel(store.state.networks[0].channels[0]);
			} else {
				navigate("Connect");
			}
		}

		if ("URLSearchParams" in window) {
			handleQueryParams();
		}
	}
});

function mergeNetworkData(newNetworks) {
	const collapsedNetworks = new Set(JSON.parse(storage.get("thelounge.networks.collapsed")));

	for (let n = 0; n < newNetworks.length; n++) {
		const network = newNetworks[n];
		const currentNetwork = store.getters.findNetwork(network.uuid);

		// If this network is new, set some default variables and initalize channel variables
		if (!currentNetwork) {
			network.isJoinChannelShown = false;
			network.isCollapsed = collapsedNetworks.has(network.uuid);
			network.channels.forEach(store.getters.initChannel);

			continue;
		}

		// Merge received network object into existing network object on the client
		// so the object reference stays the same (e.g. for currentChannel state)
		for (const key in network) {
			if (!Object.prototype.hasOwnProperty.call(network, key)) {
				continue;
			}

			// Channels require extra care to be merged correctly
			if (key === "channels") {
				currentNetwork.channels = mergeChannelData(
					currentNetwork.channels,
					network.channels
				);
			} else {
				currentNetwork[key] = network[key];
			}
		}

		newNetworks[n] = currentNetwork;
	}

	return newNetworks;
}

function mergeChannelData(oldChannels, newChannels) {
	for (let c = 0; c < newChannels.length; c++) {
		const channel = newChannels[c];
		const currentChannel = oldChannels.find((chan) => chan.id === channel.id);

		// This is a new channel that was joined while client was disconnected, initialize it
		if (!currentChannel) {
			store.getters.initChannel(channel);

			continue;
		}

		// Merge received channel object into existing currentChannel
		// so the object references are exactly the same (e.g. in store.state.activeChannel)
		for (const key in channel) {
			if (!Object.prototype.hasOwnProperty.call(channel, key)) {
				continue;
			}

			// Server sends an empty users array, client requests it whenever needed
			if (key === "users") {
				if (channel.type === "channel") {
					if (
						store.state.activeChannel &&
						store.state.activeChannel.channel === currentChannel
					) {
						// For currently open channel, request the user list straight away
						socket.emit("names", {
							target: channel.id,
						});
					} else {
						// For all other channels, mark the user list as outdated
						// so an update will be requested whenever user switches to these channels
						currentChannel.usersOutdated = true;
					}
				}

				continue;
			}

			// Server sends total count of messages in memory, we compare it to amount of messages
			// on the client, and decide whether theres more messages to load from server
			if (key === "totalMessages") {
				currentChannel.moreHistoryAvailable =
					channel.totalMessages > currentChannel.messages.length;

				continue;
			}

			// Reconnection only sends new messages, so merge it on the client
			// Only concat if server sent us less than 100 messages so we don't introduce gaps
			if (key === "messages" && currentChannel.messages && channel.messages.length < 100) {
				currentChannel.messages = currentChannel.messages.concat(channel.messages);
			} else {
				currentChannel[key] = channel[key];
			}
		}

		newChannels[c] = currentChannel;
	}

	return newChannels;
}

function handleQueryParams() {
	const params = new URLSearchParams(document.location.search);

	const cleanParams = () => {
		// Remove query parameters from url without reloading the page
		const cleanUri = window.location.origin + window.location.pathname + window.location.hash;
		window.history.replaceState({}, document.title, cleanUri);
	};

	if (params.has("uri")) {
		// Set default connection settings from IRC protocol links
		const uri = params.get("uri");
		const queryParams = parseIrcUri(uri);

		cleanParams();
		router.push({name: "Connect", query: queryParams});
	} else if (document.body.classList.contains("public") && document.location.search) {
		// Set default connection settings from url params
		const queryParams = Object.fromEntries(params.entries());

		cleanParams();
		router.push({name: "Connect", query: queryParams});
	}
}
