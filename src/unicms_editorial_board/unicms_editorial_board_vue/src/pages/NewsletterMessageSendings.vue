<template>
    <CompleteTable
        :api_source="api_source"
        :dates="dates"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false"
        :showIsActive="false"
        :sortDesc="sortDesc">

        <template #html_file="data">
            <a :href="data.data.value"
               target="_blank"
               :title="data.data.value">
                <b-icon
                    icon="file-text"
                    style="cursor: pointer">
                </b-icon>
            </a>
        </template>

    </CompleteTable>
</template>
<script>
import CompleteTable from '../layout/CompleteTable.vue'

export default {
    components: {
        CompleteTable
    },
    data () {
        return {
            api_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/'+this.$route.params.message_id+'/sendings/',
            newsletter_id: this.$route.params.newsletter_id,
            message_id: this.$route.params.message_id,
            fields: [
                'id',
                'date',
                {key: 'html_file', label: 'HTML'},
                'recipients',
            ],
            dates: ['date'],
            sortDesc: '-',
            ordering: 'date',
            ordering_list: [{ text: 'Date', value: 'date' }],
            page_title: 'Newsletter message sendings'
        }
    }
}
</script>
