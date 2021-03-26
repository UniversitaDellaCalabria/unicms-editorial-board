<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>
            <div class="row">
                <div class="col-md-12">
                    <b-card title="My active WebSites">
                        <b-card-text class="mt-4">
                            <div class="all-icons">
                                <div class="row websites-cards">
                                    <div class="col-lg-3 col-md-6 col-sm-12 mb-3" v-for="item in items">
                                        <b-card>
                                            <b-card-text>
                                                <h4 class="mt-2 mb-3">
                                                    <b-icon icon="globe" scale="0.8"></b-icon>
                                                    {{ item.name }}
                                                </h4>
                                                <hr>
                                                <p class="mt-3">{{ item.domain }}</p>
                                            </b-card-text>
                                            <template #footer>
                                                <router-link :to="{ name: 'Webpaths',
                                                                    params: { site_id: item.id }}"
                                                    class="btn btn-info">
                                                    Manage
                                                </router-link>
                                            </template>
                                        </b-card>
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
