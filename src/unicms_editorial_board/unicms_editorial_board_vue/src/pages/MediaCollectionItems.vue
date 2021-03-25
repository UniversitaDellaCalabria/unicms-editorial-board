<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'MediaCollectionItemNew',
                                params: { collection_id: collection_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'MediaCollectionItemEdit',
                            params: { collection_id: collection_id,
                                      collection_item_id: item.item.id}}"
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
            api_source: '/api/editorial-board/media-collections/'+this.$route.params.collection_id+'/items/',
            collection_id: this.$route.params.collection_id,
            fields: [
                'id',
                {key: 'media', thClass: 'w-25'},
                'order',
                { key: 'is_active', label: 'Active'},
                'actions'
            ],
            images: ['media'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Media collection items'
        }
    }
}
</script>
