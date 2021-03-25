<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'PublicationGalleryNew',
                                params: { publication_id: publication_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'MediaCollectionEdit',
                                params: { collection_id: item.item.collection.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="arrow-right-circle"
                    variant="secondary"></b-icon>
                Go to gallery
            </router-link>
            <router-link :to="{ name: 'PublicationGalleryEdit',
                            params: { publication_id: publication_id,
                                      gallery_id: item.item.id }}"
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
            api_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/galleries/',
            fields: [
                'id',
                {key: 'collection.name', label: 'Gallery'},
                'order',
                { key: 'is_active', label: 'Active'},
                'actions'
            ],
            images: ['media'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Collection name', value: 'collection.name' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Publication galleries',
            publication_id: this.$route.params.publication_id,
        }
    }
}
</script>
