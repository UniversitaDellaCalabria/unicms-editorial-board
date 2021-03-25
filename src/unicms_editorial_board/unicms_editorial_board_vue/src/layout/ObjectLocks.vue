<template>
    <CompleteTable
        ref="completeTable"
        :api_source="api_source"
        :fields="fields"
        :dates="dates"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :mainMethod="callApi">

        <template #add_new>
            <router-link :to="{ name: addNewClass,
                                params: { object_id: object_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

    </CompleteTable>
</template>
<script>
import CompleteTable from './CompleteTable.vue'

export default {
    name: 'ObjectLocks',
    components: {
        CompleteTable
    },
    props: {
        object_id: { type: String },
        object_api: { type: String },
        page_title: { type: String },
        addNewClass: { type: String },
    },
    data () {
        return {
            api_source: '',
            content_type: '',
            fields: [
                'id',
                'user',,
                {key: 'lock.locked_time', label: 'Lock date'},
                'actions'
            ],
            dates: ['lock.locked_time'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'User', value: 'user' }],
            page_title: 'Menu locks'
        }
    },
    methods: {
        callApi(url, page=null) {
            let target_page = page || this.$refs.completeTable.page;
            let source = this.object_api;
            if (url) source = url;
            this.axios
                .get(source)
                .then(response => {
                    this.content_type = response.data.object_content_type;
                    this.api_source = '/api/editorial-board/locks/'+this.content_type+'/'+this.object_id+'/';
                    let source2 = this.api_source + '?page=' + target_page + '&search=' + this.$refs.completeTable.search + '&ordering=' + this.$refs.completeTable.sortDesc + this.$refs.completeTable.ordering;
                    this.axios
                        .get(source2)
                        .then(response2 => {
                            this.$refs.completeTable.items = response2.data.results;
                            this.$refs.completeTable.page = response2.data.page;
                            this.$refs.completeTable.per_page = response2.data.per_page;
                            this.$refs.completeTable.prev = response2.data.previous;
                            this.$refs.completeTable.next = response2.data.next;
                            this.$refs.completeTable.total_rows = response2.data.count;
                            this.$refs.completeTable.isBusy = false
                    })
                })
        },
    }
}
</script>
