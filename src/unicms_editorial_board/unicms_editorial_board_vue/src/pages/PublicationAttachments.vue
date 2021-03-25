<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :files="files"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'PublicationAttachmentNew',
                                params: { publication_id: publication_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationAttachmentEdit',
                            params: { publication_id: publication_id,
                                      attachment_id: item.item.id}}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
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
            api_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/attachments/',
            fields: [
                'id',
                'name',
                'file',
                'file_type',
                'file_size',
                'description',
                'order',
                { key: 'is_active', label: 'Active'},
                'actions'
            ],
            files: ['file'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'File type', value: 'file_type' },
                            { text: 'File size', value: 'file_size' },
                            { text: 'Description', value: 'description' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Publication attachments',
            publication_id: this.$route.params.publication_id,
        }
    }
}
</script>
