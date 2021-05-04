<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :dates="dates"
        :showCreatedBy="false">

    </CompleteTable>
</template>
<script>
import CompleteTable from '../layout/CompleteTable.vue'

export default {
    components: {
        CompleteTable
    },
    props: {
        api_source: { type: String },
        page_title: { type: String }
    },
    data () {
        return {
            fields: [
                'id',
                'user',
                {key: 'change_message', label: 'Action'},
                {key: 'action_time', label: 'Date'},
            ],
            dates: ['action_time'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'User', value: 'user' },
                            { text: 'Date', value: 'action_time' }],
        }
    }
}
</script>
