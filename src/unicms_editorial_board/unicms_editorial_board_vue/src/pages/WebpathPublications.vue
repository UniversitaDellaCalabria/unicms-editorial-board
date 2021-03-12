<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Webpath publications">
                        <b-card-text>

                            <div class="pull-right mb-3">
                                <router-link :to="{ name: 'WebpathPublicationNew',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id }}"
                                    class="btn btn-success">
                                    <b-icon icon="plus-circle"
                                            variant="white"></b-icon>
                                    Add new
                                </router-link>
                            </div>

                            <b-form-input
                                v-model="search"
                                v-on:input="callApi(null, 1)"
                                placeholder="Search..."
                                type="search"
                                class="my-3">
                            </b-form-input>

                            <b-pagination
                                v-model="currentPage"
                                :total-rows="total_rows"
                                :per-page="per_page"
                                first-number
                                last-number
                                align="right">
                            </b-pagination>

                            <b-table
                                ref="table"
                                id="my-table"
                                striped hover responsive
                                :busy="isBusy"
                                :fields="fields"
                                :items="items"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc">

                                <template #table-busy>
                                    <div class="text-center text-danger my-2">
                                        <b-spinner
                                            small
                                            class="align-middle mr-3"
                                            type="grow"></b-spinner>
                                        <strong>loading data...</strong>
                                    </div>
                                </template>

                                <template #cell(date_start)="data">
                                    {{ $date_formatter(data.value) || '-' }}
                                </template>

                                <template #cell(date_end)="data">
                                    {{ $date_formatter(data.value) || '-' }}
                                </template>

                                <template #cell(in_evidence_start)="data">
                                    {{ $date_formatter(data.value) || '-' }}
                                </template>

                                <template #cell(in_evidence_end)="data">
                                    {{ $date_formatter(data.value) || '-' }}
                                </template>

                                <template #cell(is_active)="data">
                                    <b-icon
                                        icon="check-circle-fill"
                                        variant="success"
                                        v-if="data.value"
                                        v-on:click="changeStatus(data.item.id)"
                                        style="cursor: pointer"></b-icon>
                                    <b-icon
                                        icon="dash-circle-fill"
                                        variant="danger"
                                        style="cursor: pointer"
                                        v-on:click="changeStatus(data.item.id)"
                                        v-else></b-icon>
                                </template>

                                <template #cell(actions)="data">
                                    <router-link :to="{ name: 'PublicationEdit',
                                                    params: { publication_id: data.item.publication.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="arrow-right-circle"
                                            variant="secondary"></b-icon>
                                        Go to publication
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPublicationEdit',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-info">
                                        <b-icon icon="pencil-square"
                                            variant="white"></b-icon>
                                        Edit
                                    </router-link>
                                    <b-button
                                        class="btn-block"
                                        size="sm"
                                        @click="deleteModal(data.item)"
                                        variant="danger">
                                        <b-icon icon="trash"
                                            variant="white"></b-icon>
                                        Delete
                                    </b-button>
                                </template>

                            </b-table>

                            <b-pagination
                                v-model="currentPage"
                                :total-rows="total_rows"
                                :per-page="per_page"
                                first-number
                                last-number
                                align="right">
                            </b-pagination>
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
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            fields: [
                {key: 'publication.title', label: 'Publication', sortable: true},
                {key: 'date_start', sortable: true},
                {key: 'date_end', sortable: true},
                {key: 'in_evidence_start', sortable: true},
                {key: 'in_evidence_end', sortable: true},
                {key: 'order', sortable: true},
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            isBusy: true,
            items: [],
            page: 1,
            per_page: 0,
            total_rows: 0,
            currentPage: 1,
            next: '',
            prev: '',
            search: '',
            sortDesc: true,
        }
    },
    methods: {
        callApi(url, page=null) {
            let target_page = page || this.page;
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/?page=' + target_page + '&search=' + this.search;
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    this.items = response.data.results;
                    this.page = response.data.page;
                    this.per_page = response.data.per_page;
                    this.prev = response.data.previous;
                    this.next = response.data.next;
                    this.total_rows = response.data.count;
                    this.isBusy = false
                })
        },
        changeStatus(id) {
            let item = this.items.find(item => item.id === id);
            this.axios
                .patch('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/'+item.id+'/',
                       {is_active: !item.is_active},
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    console.log(response.data);
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath publication status changed successfully',
                          dismissable: true }
                    )}
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        remove(id) {
            this.axios
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath publication removed successfully',
                          dismissable: true }
                    )}
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        deleteModal(item) {
            this.$bvModal.msgBoxConfirm('Do you want really delete webpath publication?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.remove(item.id);
            })
        }
    },
    mounted() {
        this.callApi();
    },
    watch: {
        'currentPage': function(){
            this.isBusy = true
            this.callApi(null, this.currentPage)
        }
    }
}
</script>
