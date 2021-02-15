<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/admin/dashboard">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link to="/admin/websites">
        <i class="nc-icon nc-layers-3"></i>
        <p>Websites</p>
      </sidebar-link>

      <sidebar-link to="#">
        <i class="nc-icon nc-bullet-list-67"></i>
        <p>Menus</p>
      </sidebar-link>

      <sidebar-link to="/admin/medias">
        <i class="nc-icon nc-album-2"></i>
        <p>Medias</p>
      </sidebar-link>

      <sidebar-link to="/admin/media-collections">
        <i class="nc-icon nc-grid-45"></i>
        <p>Media collections</p>
      </sidebar-link>

      <sidebar-link to="/admin/carousels">
        <i class="nc-icon nc-button-play"></i>
        <p>Carousels</p>
      </sidebar-link>

      <sidebar-link to="/admin/publications">
        <i class="nc-icon nc-single-copy-04"></i>
        <p>Publications</p>
      </sidebar-link>


    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    }
  }

</script>
