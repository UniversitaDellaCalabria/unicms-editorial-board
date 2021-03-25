<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'PublicationLocalizationNew',
                                params: { publication_id: publication_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationLocalizationEdit',
                            params: { publication_id: publication_id,
                                      localization_id: item.item.id}}"
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
            api_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/localizations/',
            fields: [
                'id',
                'language',
                'title',
                {key: 'is_active', sortable: true},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Language', value: 'language' },
                            { text: 'Title', value: 'title' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Publication localizations',
            publication_id: this.$route.params.publication_id,
        }
    }
}
</script>
