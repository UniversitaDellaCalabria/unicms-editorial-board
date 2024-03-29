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

                            <div class="text-right mb-3">
                                <router-link :to="{ name: 'MenuItemNew',
                                                    params: { menu_id: menu_id }}"
                                    class="btn btn-success">
                                    <b-icon icon="plus-circle"
                                            variant="white"></b-icon>
                                    Add new
                                </router-link>
                            </div>

                            <div class="row pt-3">
                                <div
                                    class="col col-12 col-sm">
                                    <b-form-input
                                        v-model="search"
                                        v-on:input="filterTable()"
                                        placeholder="Search..."
                                        type="search"
                                        class="mb-3">
                                    </b-form-input>
                                </div>
                            </div>

                            <b-table
                                ref="table"
                                id="my-table"
                                striped hover responsive
                                :busy="isBusy"
                                :fields="fields"
                                :filter="filter"
                                :filter-included-fields="filterOn"
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

                                <template #cell(parent_name)="data">
                                    {{ data.value || '-' }}
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

                                <template #cell(related)="item">
                                    <router-link :to="{ name: 'MenuItemLocalizations',
                                                    params: { menu_id: menu_id,
                                                              menu_item_id: item.item.id}}"
                                        class="btn btn-block btn-sm btn-outline-secondary">
                                        <b-icon icon="flag"
                                            variant="secondary"></b-icon>
                                        Localizations
                                    </router-link>
                                </template>


                                <template #cell(actions)="data">
                                    <router-link :to="{ name: 'MenuItemEdit',
                                                        params: { menu_id: menu_id,
                                                                  menu_item_id: data.item.id }}"
                                        class="btn mr-1 btn-sm btn-info">
                                        <b-icon icon="pencil-square"
                                            variant="white"></b-icon>
                                        Edit
                                    </router-link>
                                    <b-button
                                        class=""
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
import OrderingFilter from '../components/Tables/OrderingFilter.vue'

export default {
    components: {
        OrderingFilter
    },
    data () {
        return {
            alerts: this.$route.params.alerts || [],
            menu_id: this.$route.params.menu_id,
            fields: [
                'id',
                'name',
                {key: 'parent_name', label: 'Parent'},
                'order',
                {key: 'is_active', label: 'Active'},
                {key: 'related', label: 'Related'},
                'actions'
            ],
            filter: null,
            filterOn: ['name', 'parent_name'],
            isBusy: true,
            items: [],
            page_title: '',
            search: '',
            sortDesc: '',
            ordering: 'id',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'Parent', value: 'parent_name' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
        }
    },
    methods: {
        get_childs(menu_item){
            menu_item.name = '– '.repeat(menu_item.level) + menu_item.name
            if (menu_item.level > 1)
                menu_item.name = '┊  ' + menu_item.name
            this.items.push(menu_item);
            if (menu_item.childs)
               menu_item.childs.forEach(item => this.get_childs(item));
        },
        callApi(url) {
            let source = '/api/editorial-board/menus/'+this.menu_id+'/items/';
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    response.data.childs.forEach(item => this.get_childs(item));
                    this.page_title = response.data.name + ' items';
                    this.isBusy = false
                })
        },
        changeStatus(id) {
            let item = this.items.find(item => item.id === id);
            this.axios
                .patch('/api/editorial-board/menus/'+this.menu_id+'/items/'+item.id+'/',
                       {is_active: !item.is_active},
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    item.is_active = response.data.is_active;
                    this.alerts.push(
                        { variant: 'success',
                          message: response.data.name + ' status changed successfully',
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
                .delete('/api/editorial-board/menus/'+this.menu_id+'/items/'+id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.items.splice(this.items.findIndex(el => el.id === id), 1);
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu item removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete menu item?', {
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
        filterTable() {
            let table = document.getElementById("my-table");
            for (let i = 0, row; row = table.rows[i]; i++) {
                if(this.search=="")
                    row.hidden = false
                else {
                    let search_lower = this.search.toLowerCase()
                    let content = row.cells[1].textContent.toLowerCase()
                    if(!content.includes(search_lower))
                        row.hidden = true
                    else row.hidden = false
                }
            }
        }
    },
    mounted() {
        this.callApi();
    }
  }
</script>
