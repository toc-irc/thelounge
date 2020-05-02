<template>
	<button id='hamburger' class="lt" aria-label="Toggle channel list" @click="$store.commit('toggleSidebar')" />
</template>
<script>
export default {
	name: "SidebarToggle",
        mounted(e) {
          if(this.$store.state.networks.length==0) {
            document.getElementById('hamburger').classList.add('quickshake');
          }
        }
};
</script>
