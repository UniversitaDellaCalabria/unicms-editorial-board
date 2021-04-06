<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card :title="page_title">
                        <b-card-text>

                            <slot name="text"></slot>

                            <div class="text-right mb-3">
                                <slot name="add_new"></slot>
                            </div>

                            <div class="row pt-3">
                                <div class="col col-12 col-md-8">
                                    <b-form-input
                                        v-model="search"
                                        v-on:input="callApi(null, 1)"
                                        placeholder="Search..."
                                        type="search"
                                        class="mb-3">
                                    </b-form-input>
                                </div>
                                <div class="col col-12 col-md-4">
                                    <OrderingFilter
                                        :ordering="ordering"
                                        @updateOrdering="ordering = $event;"
                                        :ordering_list="ordering_list"
                                        :sortDesc="sortDesc"
                                        @updateSortDesc="sortDesc = $event;"
                                        :ordering="ordering"
                                        @callApi="callApi(null, page)"
                                    />
                                </div>
                            </div>

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

                                <template #cell(state)="data">
                                    <slot name="state" :data="data"></slot>
                                </template>

                                <template #cell(is_active)="data">
                                    <slot name="activation" :data="data">
                                        <b-icon icon="check-circle-fill"
                                            variant="success"
                                            v-if="data.value"
                                            v-on:click="changeStatus(data.item)"
                                            style="cursor: pointer"></b-icon>
                                        <b-icon icon="dash-circle-fill"
                                            variant="danger"
                                            style="cursor: pointer"
                                            v-on:click="changeStatus(data.item)"
                                            v-else></b-icon>
                                    </slot>
                                </template>

                                <template #cell(childs)="data">
                                    <slot name="childs" :item="data.item"></slot>
                                </template>

                                <template #cell(actions)="data">
                                    <slot name="actions" :item="data.item"></slot>
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

                                <template #cell()="data">
                                    <a :href="data.value"
                                        v-if="files && isFile(data.field.key) && data.value">
                                        <b-icon
                                            icon="file-text"
                                            style="cursor: pointer">
                                        </b-icon>
                                    </a>
                                    <b-img
                                        v-else-if="images && isImage(data.field.key) && data.value"
                                        :src="data.value.file || data.value"
                                        fluid
                                        alt="Responsive image">
                                    </b-img>
                                    <span
                                        v-else-if="arrays && isArray(data.field.key) && data.value">
                                        <div v-for="obj in data.value">
                                            {{ obj[getArrayMap(data.field.key)] }}
                                        </div>
                                    </span>
                                    <span v-else-if="dates && isDate(data.field.key) && data.value">
                                        {{ $date_formatter(data.value)}}
                                    </span>
                                    <span v-else>{{ data.value || '-' }}</span>
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
import OrderingFilter from '../components/Tables/OrderingFilter.vue'

export default {
    name: 'CompleteTable',
    components: {
        OrderingFilter
    },
    props: {
        api_source: { type: String },
        arrays: { type: Array },
        arrays_map: { type: Array },
        dates: { type: Array },
        fields: { type: Array },
        files: { type: Array },
        images: { type: Array },
        mainMethod: { type: Function },
        ordering_list: { type: Array },
        page_title: { type: String }
    },
    data () {
        return {
            alerts: this.$route.params.alerts || [],
            carousel_id: this.$route.params.carousel_id,
            carousel_item_id: this.$route.params.carousel_item_id,
            isBusy: true,
            items: [],
            page: 1,
            per_page: 0,
            total_rows: 0,
            currentPage: 1,
            next: '',
            prev: '',
            search: '',
            sortDesc: '+',
            ordering: 'id'
        }
    },
    methods: {
        isDate(key){
            return this.dates.filter(n=>n===key).length===0?false:true;
        },
        isFile(key){
            return this.files.filter(n=>n===key).length===0?false:true;
        },
        isImage(key){
            return this.images.filter(n=>n===key).length===0?false:true;
        },
        isArray(key){
            return this.arrays.filter(n=>n===key).length===0?false:true;
        },
        getArrayMap(key){
            for (let i=0; i<this.arrays_map.length; i++)
                if (this.arrays_map[i][key])
                    return this.arrays_map[i][key]
        },
        callApi(url, page=null) {
            if (this.mainMethod) {
                this.mainMethod(url, page);
            }
            else {
                let target_page = page || this.page;
                let source = this.api_source + '?page=' + target_page + '&search=' + this.search + '&ordering=' + this.sortDesc + this.ordering;
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
            }
        },
        changeStatus(item) {
            this.axios
                .patch(this.api_source +item.id + '/',
                       {is_active: !item.is_active},
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: 'item status changed successfully',
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
                .delete(this.api_source + id + '/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'item removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete item?', {
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
