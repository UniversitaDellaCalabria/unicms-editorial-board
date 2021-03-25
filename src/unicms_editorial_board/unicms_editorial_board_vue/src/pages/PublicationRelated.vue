<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :arrays="arrays"
        :arrays_map="arrays_map"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'PublicationRelatedNew',
                                params: { publication_id: publication_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationEdit',
                                params: { publication_id: item.item.related.id }}"
                    class="btn btn-block btn-sm btn-outline-secondary">
                    <b-icon icon="arrow-right-circle"
                        variant="secondary"></b-icon>
                    Go to publication
                </router-link>
                <router-link :to="{ name: 'PublicationRelatedEdit',
                                params: { publication_id: publication_id,
                                          related_id: item.item.id}}"
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
            api_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/related/',
            arrays: ['related.category'],
            arrays_map: [{'related.category': 'name'}],
            fields: [
                'id',
                {key: 'related.title', label: 'Title'},
                {key: 'related.category', label: 'Category'},
                {key: 'related.relevance', label: 'Relevance'},
                {key: 'is_active', sortable: true},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Title', value: 'related.title' },
                            { text: 'Relevance', value: 'related.relevance' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Publication related',
            publication_id: this.$route.params.publication_id,
        }
    }
}
</script>
