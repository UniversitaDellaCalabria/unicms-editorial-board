<template>
  <div class="wrapper">
    <side-bar
        v-if="mode != 'raw'">
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <b-icon icon="graph-up"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Dashboard</p>
      </sidebar-link>

        <sidebar-link to="/blocks">
        <b-icon icon="bricks"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Blocks</p>
      </sidebar-link>

        <sidebar-link to="/calendars">
        <b-icon icon="calendar2-date"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Calendars</p>
      </sidebar-link>

        <sidebar-link to="/carousels">
        <b-icon icon="collection-play"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Carousels</p>
      </sidebar-link>

        <sidebar-link to="/contacts">
        <b-icon icon="person-lines-fill"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Contacts</p>
      </sidebar-link>

        <sidebar-link to="/events">
        <b-icon icon="calendar2-event"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Events</p>
      </sidebar-link>

        <sidebar-link to="/media">
        <b-icon icon="folder"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Media</p>
      </sidebar-link>

        <sidebar-link to="/media-collections">
        <b-icon icon="folder-check"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Media collections</p>
      </sidebar-link>

      <sidebar-link to="/menus">
        <b-icon icon="menu-button-wide-fill"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Menus</p>
      </sidebar-link>

      <sidebar-link to="/newsletters">
        <b-icon icon="mailbox"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Newsletters</p>
      </sidebar-link>

      <sidebar-link to="/publications">
        <b-icon icon="file-earmark-text"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Publications</p>
      </sidebar-link>

        <sidebar-link to="/websites">
        <b-icon icon="globe"
            class="mr-4 ml-1"
            variant="white"
            scale="1.9">
        </b-icon>
        <p>Websites</p>
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
    data() {
        return {
            mode: '',
        }
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    },
    mounted() {
        this.mode = this.$route.query.mode
    }
  }
</script>
