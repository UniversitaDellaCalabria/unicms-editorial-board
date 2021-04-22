<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :ordering_list="ordering_list"
        :page_title="page_title">
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
            fields: ['name',
                     {key: 'type_friendly', label: 'type_friendly'},
                     'image',
                     'description',
            ],
            images: ['image'],
            ordering_list: [{ text: 'Name', value: 'name' },
                            { text: 'Type', value: 'type_friendly' },
                            { text: 'Description', value: 'description' }],
            page_title: 'Template blocks'
        }
    }
}
</script>
