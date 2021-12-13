<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false">

        <template #add_new>
            <router-link :to="{ name: 'CalendarEventNew',
                                params: { calendar_id: calendar_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'EventEdit',
                                params: { event_id: item.item.event.id }}"
                    class="btn btn-block btn-sm btn-outline-secondary">
                    <b-icon icon="arrow-right-circle"
                        variant="secondary"></b-icon>
                    Go to event
                </router-link>
            <router-link :to="{ name: 'CalendarEventEdit',
                            params: { calendar_id: calendar_id,
                                      calendar_event_id: item.item.id}}"
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
            api_source: '/api/editorial-board/calendars/'+this.$route.params.calendar_id+'/events/',
            calendar_id: this.$route.params.calendar_id,
            fields: [
                'id',
                {key: 'event.publication_data.preview_image', label: 'Preview image', thClass: 'w-25'},
                {key: 'event.publication_data.presentation_image', label: 'Image', tthClass: 'w-25'},
                {key: 'event.publication_data.name', label: 'Name'},
                {key: 'event.publication_data.title', label: 'Title'},
                'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            files: ['event.publication_data.preview_image', 'event.publication_data.presentation_image'],
            ordering: 'order',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'event__publication__name' },
                            { text: 'Title', value: 'event__publication__title' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Calendar events'
        }
    }
}
</script>
