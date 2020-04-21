"use strict";

const log = require("./log");
const fs = require("fs");
const net = require("net");
const colors = require("chalk");
const Helper = require("./helper");

class Identification {
	constructor(startedCallback) {
		this.connectionId = 0;
		this.connections = new Map();

		if (typeof Helper.config.oidentd === "string") {
			this.oidentdFile = Helper.expandHome(Helper.config.oidentd);
			log.info(`Oidentd file: ${colors.green(this.oidentdFile)}`);

			this.refresh();
		}

		if (Helper.config.identd.enable) {
			if (this.oidentdFile) {
				log.warn(
					"Using both identd and oidentd at the same time, this is most likely not intended."
				);
			}

			const server = net.createServer(this.serverConnection.bind(this));

			server.on("error", (err) => log.error(`Identd server error: ${err}`));

			server.listen(
				{
					port: Helper.config.identd.port || 113,
					host: Helper.config.bind,
				},
				() => {
					const address = server.address();
					log.info(
						`Identd server available on ${colors.green(
							address.address + ":" + address.port
						)}`
					);

					startedCallback(this);
				}
			);
		} else {
			startedCallback(this);
		}
	}

	serverConnection(socket) {
		socket.on("error", (err) => log.error(`Identd socket error: ${err}`));
		socket.on("data", (data) => {
			this.respondToIdent(socket, data);
			socket.end();
		});
	}

	respondToIdent(socket, data) {
		data = data.toString().split(",");

		const lport = parseInt(data[0], 10) || 0;
		const fport = parseInt(data[1], 10) || 0;

		if (lport < 1 || fport < 1 || lport > 65535 || fport > 65535) {
			return;
		}

		for (const connection of this.connections.values()) {
			if (connection.socket.remotePort === fport && connection.socket.localPort === lport) {
				return socket.write(
					`${lport}, ${fport} : USERID : TheLounge : ${connection.user}\r\n`
				);
			}
		}

		socket.write(`${lport}, ${fport} : ERROR : NO-USER\r\n`);
	}

	addSocket(socket, user) {
		const id = ++this.connectionId;

		this.connections.set(id, {socket, user});

		if (this.oidentdFile) {
			this.refresh();
		}

		return id;
	}

	removeSocket(id) {
		this.connections.delete(id);

		if (this.oidentdFile) {
			this.refresh();
		}
	}

	refresh() {
		let file =
			"# Warning: file generated by irc.imperialfamily.com: changes will be overwritten!\n";

		this.connections.forEach((connection) => {
			file +=
				`fport ${connection.socket.remotePort}` +
				` lport ${connection.socket.localPort}` +
				` { reply "${connection.user}" }\n`;
		});

		fs.writeFile(this.oidentdFile, file, {flag: "w+"}, function (err) {
			if (err) {
				log.error("Failed to update oidentd file!", err);
			}
		});
	}
}

module.exports = Identification;
