<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'MediaNew'}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'MediaEdit',
                            params: { media_id: item.item.id }}"
                class="btn-block btn btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'MediaLocks',
                                params: { media_id: item.item.id }}"
                class="btn btn-block btn-sm btn-secondary">
                <b-icon icon="lock"
                    variant="white"></b-icon>
                Allowed users
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
            api_source: '/api/editorial-board/medias/',
            collection_id: this.$route.params.collection_id,
            fields: [
                'id',
                'title',
                {key: 'file', thClass: 'w-25'},
                {key: 'file_size', label: 'Size (kb)'},
                {key: 'file_dimensions', label: 'Dimensions'},
                'description',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            images: ['file'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Title', value: 'title' },
                            { text: 'Description', value: 'description' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Media'
        }
    }
}
</script>
