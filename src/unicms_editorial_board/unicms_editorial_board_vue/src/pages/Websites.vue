<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <b-card-title>{{ page_title }}</b-card-title>
                        <b-card-text>

                            <b-table
                                ref="table"
                                id="my-table"
                                striped hover responsive
                                :busy="isBusy"
                                :fields="fields"
                                :items="items">

                                <template #table-busy>
                                    <div class="text-center text-danger my-2">
                                        <b-spinner
                                            small
                                            class="align-middle mr-3"
                                            type="grow"></b-spinner>
                                        <strong>loading data...</strong>
                                    </div>
                                </template>

                                <template #cell(actions)="data">
                                    <router-link :to="{ name: 'Webpaths',
                                                        params: { site_id: data.item.id }}"
                                        class="btn mr-1 btn-sm btn-info">
                                        <b-icon icon="pencil-square"
                                            variant="white"></b-icon>
                                       Manage
                                    </router-link>
                                    <a :href="'//'+data.item.domain"
                                       target="_blank"
                                       class="btn mr-1 btn-sm btn-success">
                                        <b-icon icon="link45deg"
                                            variant="white"></b-icon>
                                       Open URL
                                    </a>
                                </template>

                            </b-table>

                            <b-button
                                variant="outline-secondary"
                                v-if="prev"
                                @click="callApi(prev)"
                                class="float-left">
                                Previous page
                            </b-button>
                            <b-button
                                variant="outline-secondary"
                                v-if="next"
                                @click="callApi(next)"
                                class="float-right">
                                Next page
                            </b-button>
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
            alerts: this.$route.params.alerts || [],
            fields: [
                'id',
                'name',
                'domain',
                'actions'
            ],
            filter: null,
            filterOn: [],
            isBusy: true,
            items: [],
            page_title: 'Websites',
        }
    },
    methods: {
        callApi(url) {
            let source = '/api/editorial-board/sites/';
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    this.isBusy = false
                    this.items = response.data.results
                })
        },
    },
    mounted() {
        this.callApi();
    }
  }
</script>
