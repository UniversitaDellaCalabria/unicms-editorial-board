<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Media locks">
                        <b-card-text>

                            <div class="pull-right mb-3">
                                <router-link :to="{ name: 'MediaLockNew',
                                                    params: { media_id: media_id }}"
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

                                <template #cell(lock.locked_time)="data">
                                    {{ $date_formatter(data.value) || '-' }}
                                </template>

                                <template #cell(actions)="data">
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
            media_id: this.$route.params.media_id,
            content_type: '',
            fields: [
                {key: 'user', sortable: true},
                {key: 'lock.locked_time', label: 'Lock date', sortable: true},
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
            let source = '/api/editorial-board/medias/'+this.media_id+'/';
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    this.content_type = response.data.object_content_type;
                    let source2 = '/api/editorial-board/locks/'+response.data.object_content_type+'/'+this.media_id+'/?page=' + target_page + '&search=' + this.search;
                    this.axios
                        .get(source2)
                        .then(response2 => {
                            this.items = response2.data.results;
                            this.page = response2.data.page;
                            this.per_page = response2.data.per_page;
                            this.prev = response2.data.previous;
                            this.next = response2.data.next;
                            this.total_rows = response2.data.count;
                            this.isBusy = false
                    })
                })
        },
        remove(id) {
            this.axios
                .delete('/api/editorial-board/locks/'+this.content_type+'/'+this.media_id+'/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'lock removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete lock?', {
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
