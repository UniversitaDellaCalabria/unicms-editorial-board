<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Page blocks">
                        <b-card-text>

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
                                v-on:input="callApi()"
                                placeholder="Search..."
                                class="my-3">
                            </b-form-input>

                            <b-table
                                ref="table"
                                id="my-table"
                                striped hover responsive
                                :busy="isBusy"
                                :fields="fields"
                                :items="items"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc">

                                <template #cell(block.image)="data">
                                    <b-img
                                        v-if="data.item.block.image"
                                        :src="data.item.block.image"
                                        fluid alt="Responsive image"
                                        style="max-width: 150px">
                                    </b-img>
                                    <p v-else>-</p>
                                </template>

                                <template #cell(is_active)="data">
                                    <b-icon icon="check-circle-fill"
                                        variant="success"
                                        v-if="data.item.is_active"
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
            alerts: [],
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
            isBusy: true,
            items: [],
            next: '',
            page: 1,
            prev: '',
            search: '',
            sortDesc: true,
        }
    },
    methods: {
        toggleBusy() {
            this.isBusy = !this.isBusy
        },
        callApi(url) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/blocks/?page=' + this.page + '&search=' + this.search;
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    this.items = response.data.results;
                    this.prev = response.data.previous;
                    this.next = response.data.next;
                })
                .then(this.isBusy = false)
        },
        changeStatus(id) {
            let item = this.items.find(item => item.id === id);
            this.axios
                .patch('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/blocks/'+item.id+'/',
                       {is_active: !item.is_active},
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    console.log(response.data);
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
        this.callApi();
    }
  }
</script>
