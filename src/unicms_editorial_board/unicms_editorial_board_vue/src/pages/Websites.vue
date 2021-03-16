<template>
  <div class="content">
    <div class="container-fluid">
    <Breadcrumbs/>
      <div class="row">
        <div class="col-md-12">
          <b-card title="My active WebSites">
            <b-card-text>
            <div class="all-icons">
              <div class="row">
                <div class="font-icon-list col-lg-3 col-md-3 col-sm-4 col-6" v-for="item in items">
                  <div class="font-icon-detail">
                    <b-icon icon="globe"></b-icon>
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.domain }}</p>
                    <router-link :to="{ name: 'Webpaths',
                                        params: { site_id: item.id }}"
                                 class="mt-3 btn btn-success">
                        Manage
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
            </b-card-text>
          </b-card>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
export default {
    data () {
      return {
        items: []
      }
    },
    methods: {
        callApi() {
            this.axios
                .get('/api/editorial-board/sites/')
                .then(response => this.items = response.data.results)
        }
    },
    mounted() {
        this.callApi();
    }
  }
</script>
