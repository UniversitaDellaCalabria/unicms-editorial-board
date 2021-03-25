<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'PublicationLinkNew',
                                params: { publication_id: publication_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationLinkEdit',
                            params: { publication_id: publication_id,
                                      link_id: item.item.id}}"
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
            api_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/links/',
            fields: [
                'id',
                'name',
                'url',
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'URL', value: 'url'}],
            page_title: 'Publication links',
            publication_id: this.$route.params.publication_id,
        }
    }
}
</script>
