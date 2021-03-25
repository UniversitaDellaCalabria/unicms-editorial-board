<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'MediaCollectionNew'}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'MediaCollectionItems',
                            params: { collection_id: item.item.id }}"
                class="mr-3 btn btn-sm btn-outline-secondary">
                <b-icon icon="list-ul"
                    variant="secondary"></b-icon>
                Items
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'MediaCollectionEdit',
                                params: { collection_id: item.item.id }}"
                class="mr-3 btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'MediaCollectionLocks',
                                params: { collection_id: item.item.id }}"
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
            api_source: '/api/editorial-board/media-collections/',
            fields: [
                'id',
                'name',
                'description',
                'tags',
                { key: 'is_active', label: 'Active'},
                { key: 'childs', label: 'Related'},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'Description', value: 'description' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Media collections'
        }
    }
}
</script>
