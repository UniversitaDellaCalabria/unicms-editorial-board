<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Pages">
                        <b-card-text>

                            <div class="pull-right mb-3">
                                <router-link :to="{ name: 'WebpathPageNew',
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

                                <template #cell(base_template.template_file)="data">
                                    <b-img
                                        v-if="data.item.base_template.image"
                                        :src="data.item.base_template.image"
                                        fluid alt="Responsive image"
                                        style="max-width: 150px">
                                    </b-img>
                                    <p v-else>{{ data.value }}</p>
                                </template>

                                <template #cell(state)="data">
                                    <b-icon
                                        icon="check-circle-fill"
                                        variant="success"
                                        v-on:click="publishUnpublish(data.item.id)"
                                        v-if="data.value == 'published'"
                                        style="cursor: pointer">
                                    </b-icon>
                                    <b-icon
                                        icon="exclamation-triangle-fill"
                                        variant="warning"
                                        v-on:click="publishUnpublish(data.item.id)"
                                        style="cursor: pointer"
                                        v-else>
                                    </b-icon>
                                </template>

                                <template #cell(is_active)="data">
                                    <b-icon
                                        icon="check-circle-fill"
                                        variant="success"
                                        v-if="data.item.is_active"
                                        v-on:click="changeStatus(data.item.id)"
                                        style="cursor: pointer"></b-icon>
                                    <b-icon
                                        icon="dash-circle-fill"
                                        variant="danger"
                                        style="cursor: pointer"
                                        v-on:click="changeStatus(data.item.id)"
                                        v-else></b-icon>
                                </template>

                                <template #cell(childs)="data">
                                    <router-link :to="{ name: 'WebpathPageBlocks',
                                                        params: { site_id: site_id,
                                                                  webpath_id: webpath_id,
                                                                  page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="box-seam"
                                            variant="secondary"></b-icon>
                                        Blocks
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPageCarousels',
                                                        params: { site_id: site_id,
                                                                  webpath_id: webpath_id,
                                                                  page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="collection-play"
                                            variant="secondary"></b-icon>
                                        Carousels
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPageLinks',
                                                        params: { site_id: site_id,
                                                                  webpath_id: webpath_id,
                                                                  page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="link45deg"
                                            variant="secondary"></b-icon>
                                        Links
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPageLocalizations',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="flag"
                                            variant="secondary"></b-icon>
                                        Localizations
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPageMedias',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="card-image"
                                            variant="secondary"></b-icon>
                                        Medias
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPageMenus',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="menu-button-wide-fill"
                                            variant="secondary"></b-icon>
                                        Menu
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPagePublications',
                                                        params: { site_id: site_id,
                                                                  webpath_id: webpath_id,
                                                                  page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="file-text"
                                            variant="secondary"></b-icon>
                                        Publications
                                    </router-link>
                                    <router-link :to="{ name: 'WebpathPageRelated',
                                                        params: { site_id: site_id,
                                                                  webpath_id: webpath_id,
                                                                  page_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="share"
                                            variant="secondary"></b-icon>
                                        Related pages
                                    </router-link>
                                </template>

                                <template #cell(actions)="data">
                                    <b-button
                                        :href="data.item.preview_url"
                                        target="_blank"
                                        class="btn btn-block btn-sm btn-secondary text-white">
                                        <b-icon icon="eye"
                                            variant="white"></b-icon>
                                        Preview
                                    </b-button>
                                    <b-button
                                        @click="copyAsDraftModal(data.item)"
                                        class="btn btn-block btn-sm btn-warning text-white">
                                        <b-icon icon="files"
                                            variant="white"></b-icon>
                                        Copy as draft
                                    </b-button>
                                    <router-link :to="{ name: 'WebpathPageEdit',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: data.item.id }}"
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
                {key: 'name', label: 'Page name', sortable: true},
                {key: 'title', label: 'Page title', sortable: true},
                {key: 'base_template.template_file', label: 'Template', sortable: true},
                {key: 'date_start', sortable: true},
                {key: 'date_end', sortable: true},
                {key: 'type', sortable: true},
                {key: 'state', label: 'Published', sortable: true},
                {key: 'is_active', label: 'Active'},
                {key: 'childs', label: 'Related'},
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
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/?page=' + target_page + '&search=' + this.search;
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
        copyAsDraft(id){
            this.axios
                .get('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+id+'/copy-as-draft/')
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath page copied as draft successfully',
                          dismissable: true }
                    );
                    this.callApi();
                    }
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        changeStatus(id) {
            let item = this.items.find(item => item.id === id);
            this.axios
                .get('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+item.id+'/change-status/')
                .then(response => {
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath page status changed successfully',
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
        publishUnpublish(id) {
            let item = this.items.find(item => item.id === id);
            let published = this.items.find(published => published.id === item.draft_of);
            this.axios
                .get('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+item.id+'/change-publication-status/')
                .then(response => {
                    item.state = response.data.state;
                    if (published)
                        published.is_active = false
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath page status changed successfully',
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
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath page removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete webpath page?', {
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
        },
        copyAsDraftModal(item) {
            this.$bvModal.msgBoxConfirm('Do you want really copy webpath page as draft?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'warning',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.copyAsDraft(item.id);
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
