<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <b-icon icon="graph-up"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link to="/websites">
        <b-icon icon="globe"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Websites</p>
      </sidebar-link>

      <sidebar-link to="/menus">
        <b-icon icon="menu-button-wide-fill"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Menus</p>
      </sidebar-link>

      <sidebar-link to="/media">
        <b-icon icon="image"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Media</p>
      </sidebar-link>

      <sidebar-link to="/media-collections">
        <b-icon icon="images"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Media collections</p>
      </sidebar-link>

      <sidebar-link to="/carousels">
        <b-icon icon="collection-play"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Carousels</p>
      </sidebar-link>

      <sidebar-link to="/publications">
        <b-icon icon="file-earmark-text"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
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
