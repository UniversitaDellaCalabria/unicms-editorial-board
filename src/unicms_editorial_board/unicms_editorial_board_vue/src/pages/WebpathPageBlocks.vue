<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Page blocks">
                        <b-card-text>

                            <p>
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut aliquip ex ea commodo consequat.
                                Duis aute irure dolor in reprehenderit in voluptate
                                velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit
                                anim id est laborum."
                            </p>

                            <div class="accordion" role="tablist">
                                <b-button block v-b-toggle.accordion-1 variant="info">
                                    Template default blocks
                                </b-button>
                                <b-collapse
                                    id="accordion-1"
                                    accordion="blocks-accordion"
                                    role="tabpanel">
                                    <b-table
                                        ref="table"
                                        id="blocks-table"
                                        striped hover responsive
                                        :busy="isBusy"
                                        :fields="template_blocks_fields"
                                        :items="template_blocks_items"
                                        class="mt-1">
                                </b-collapse>
                            </div>
                            <hr class="my-3" />
                            <div class="pull-right mb-3">
                                <router-link :to="{ name: 'WebpathPageBlockNew',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: page_id }}"
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

                                <template #cell(block.image)="data">
                                    <b-img
                                        v-if="data.value"
                                        :src="data.value"
                                        fluid alt="Responsive image"
                                        style="max-width: 150px">
                                    </b-img>
                                    <p v-else>-</p>
                                </template>

                                <template #cell(is_active)="data">
                                    <b-icon icon="check-circle-fill"
                                        variant="success"
                                        v-if="data.value"
                                        v-on:click="changeStatus(data.item.id)"
                                        style="cursor: pointer"></b-icon>
                                    <b-icon icon="dash-circle-fill"
                                        variant="danger"
                                        style="cursor: pointer"
                                        v-on:click="changeStatus(data.item.id)"
                                        v-else></b-icon>
                                </template>

                                <template #cell(actions)="data">
                                    <router-link :to="{ name: 'WebpathPageBlockEdit',
                                                        params: { site_id: site_id,
                                                                  webpath_id: webpath_id,
                                                                  page_id: page_id,
                                                                  block_id: data.item.id }}"
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
            page_id: this.$route.params.page_id,
            fields: [
                {key: 'block.name', label: 'Block', sortable: true},
                {key: 'block.image', label: 'Image', sortable: true},
                {key: 'section', sortable: true},
                {key: 'block.description', label: 'Description'},
                {key: 'order', sortable: true},
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            template_blocks_fields: [
                {key: 'block.name', label: 'Block'},
                {key: 'block.image', label: 'Image'},
                {key: 'section'},
                {key: 'order'},
                {key: 'block.description', label: 'Description'}
            ],
            isBusy: true,
            items: [],
            template_blocks_items: [],
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
        getTemplateBlocks() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    let template_id = response.data.base_template.id;
                    let source = '/api/editorial-board/templates/'+template_id+'/blocks/';
                    this.axios
                        .get(source)
                        .then(response => {
                            this.template_blocks_items = response.data;
                        })
                })
        },
        callApi(url, page=null) {
            let target_page = page || this.page;
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/blocks/?page=' + target_page + '&search=' + this.search;
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
                .patch('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/blocks/'+item.id+'/',
                       {is_active: !item.is_active},
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page media status changed successfully',
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
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/blocks/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page block removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete block?', {
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
        this.getTemplateBlocks();
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
