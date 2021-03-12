<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Publication galleries">
                        <b-card-text>

                            <div class="pull-right mb-3">
                                <router-link :to="{ name: 'PublicationGalleryNew',
                                                    params: { publication_id: publication_id }}"
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

                                <template #table-busy>
                                    <div class="text-center text-danger my-2">
                                        <b-spinner
                                            small
                                            class="align-middle mr-3"
                                            type="grow"></b-spinner>
                                        <strong>loading data...</strong>
                                    </div>
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
                                    <router-link :to="{ name: 'MediaCollectionEdit',
                                                        params: { collection_id: data.item.collection.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="arrow-right-circle"
                                            variant="secondary"></b-icon>
                                        Go to gallery
                                    </router-link>
                                    <router-link :to="{ name: 'PublicationGalleryEdit',
                                                    params: { publication_id: publication_id,
                                                              gallery_id: data.item.id }}"
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
            alerts: this.$route.params.alerts || [],
            publication_id: this.$route.params.publication_id,
            fields: [
                {key: 'collection.name', label: 'Gallery', sortable: true},
                {key: 'order', sortable: true},
                { key: 'is_active', label: 'Active'},
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
            let source = '/api/editorial-board/publications/'+this.publication_id+'/galleries/?page=' + this.page + '&search=' + this.search;
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    this.items = response.data.results;
                    this.prev = response.data.previous;
                    this.next = response.data.next;
                    this.toggleBusy();
                })
        },
        changeStatus(id) {
            let item = this.items.find(item => item.id === id);
            this.axios
                .patch('/api/editorial-board/publications/'+this.publication_id+'/galleries/'+item.id+'/',
                       {is_active: !item.is_active},
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    console.log(response.data);
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication gallery status changed successfully',
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
                .delete('/api/editorial-board/publications/'+this.publication_id+'/galleries/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication gallery removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete gallery?', {
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
