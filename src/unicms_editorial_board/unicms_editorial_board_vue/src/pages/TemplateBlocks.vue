<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false"
        :showIsActive="false" >
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
            api_source: '/api/editorial-board/templates/blocks/',
            fields: ['id',
                     'name',
                     {key: 'type_friendly', label: 'Type'},
                     'image',
                     'description',
            ],
            files: ['image'],
            ordering: 'type',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'Type', value: 'type' },
                            { text: 'Description', value: 'description' }],
            page_title: 'Template blocks'
        }
    }
}
</script>
