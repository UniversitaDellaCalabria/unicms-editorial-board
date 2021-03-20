<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Publications">
                        <b-card-text>

                            <div class="pull-right mb-3">
                                <router-link :to="{ name: 'PublicationNew'}"
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

                                <template #cell(presentation_image)="data">
                                    <b-img :src="data.value.file" fluid alt="Responsive image"></b-img>
                                </template>

                                <template #cell(category)="data">
                                    <div v-for="cat in data.value">
                                        {{ cat.name }}
                                    </div>
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

                                <template #cell(childs)="data">
                                    <router-link :to="{ name: 'PublicationAttachments',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="file-text"
                                            variant="secondary"></b-icon>
                                        Attachments
                                    </router-link>
                                    <router-link :to="{ name: 'PublicationGalleries',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="card-image"
                                            variant="secondary"></b-icon>
                                        Galleries
                                    </router-link>
                                    <router-link :to="{ name: 'PublicationLinks',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="link45deg"
                                            variant="secondary"></b-icon>
                                        Links
                                    </router-link>
                                    <router-link :to="{ name: 'PublicationLocalizations',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="flag"
                                            variant="secondary"></b-icon>
                                        Localizations
                                    </router-link>
                                    <router-link :to="{ name: 'PublicationRelated',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="share"
                                            variant="secondary"></b-icon>
                                        Related publications
                                    </router-link>
                                </template>

                                <template #cell(actions)="data">
                                    <router-link :to="{ name: 'PublicationEdit',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-info">
                                        <b-icon icon="pencil-square"
                                            variant="white"></b-icon>
                                        Edit
                                    </router-link>
                                    <router-link :to="{ name: 'PublicationLocks',
                                                        params: { publication_id: data.item.id }}"
                                        class="btn btn-block btn-sm btn-secondary">
                                        <b-icon icon="lock"
                                            variant="white"></b-icon>
                                        Allow users
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
            collection_id: this.$route.params.collection_id,
            fields: [
                {key: 'title', sortable: true},
                {key: 'category', sortable: true},
                {key: 'relevance', sortable: true},
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
            let source = '/api/editorial-board/publications/?page=' + target_page + '&search=' + this.search;
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
                .get('/api/editorial-board/publications/'+item.id+'/change-status/')
                .then(response => {
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: response.data.title + ' status changed successfully',
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
                .delete('/api/editorial-board/publications/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete publication?', {
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
