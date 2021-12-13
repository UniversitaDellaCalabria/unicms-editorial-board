<template>
    <CompleteTable
        :api_source="api_source"
        :dates="dates"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'EventNew'}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationEdit',
                                params: { publication_id: item.item.publication }}"
                    class="btn btn-block btn-sm btn-outline-secondary">
                    <b-icon icon="arrow-right-circle"
                        variant="secondary"></b-icon>
                    Go to publication
                </router-link>
            <router-link :to="{ name: 'EventEdit',
                                params: { event_id: item.item.id }}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'EventLocks',
                                params: { event_id: item.item.id }}"
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
            api_source: '/api/editorial-board/events/',
            fields: [
                'id',
                { key: 'publication_data.name', label: 'Name'},
                { key: 'publication_data.title', label: 'Title'},
                {key: 'publication_data.preview_image', label: 'Preview image', thClass: 'w-25'},
                {key: 'publication_data.presentation_image', label: 'Image', tthClass: 'w-25'},
                { key: 'date_start', label: 'Start'},
                { key: 'date_end', label: 'End'},
                { key: 'order', label: 'Order'},
                { key: 'is_active', label: 'Active'},
                'actions'
            ],
            dates: ['date_start', 'date_end'],
            files: ['publication_data.preview_image',
                    'publication_data.presentation_image'],
            ordering: 'order',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'publication__name' },
                            { text: 'Title', value: 'publication__title' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Events'
        }
    }
}
</script>
