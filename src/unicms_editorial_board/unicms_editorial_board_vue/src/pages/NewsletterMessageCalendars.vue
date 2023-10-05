<template>
    <CompleteTable
        :api_source="api_source"
        :dates="dates"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false">

        <template #add_new>
            <router-link :to="{ name: 'NewsletterMessageCalendarNew',
                                params: { newsletter_id: newsletter_id,
                                          message_id: message_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'NewsletterMessageCalendarEdit',
                            params: { newsletter_id: newsletter_id,
                                      message_id: message_id,
                                      calendar_id: item.item.id}}"
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
            api_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/'+this.$route.params.message_id+'/calendars/',
            newsletter_id: this.$route.params.newsletter_id,
            message_id: this.$route.params.message_id,
            fields: [
                'id',
                {key: 'calendar_data', label: 'Calendar'},
                {key: 'news_from', label: 'Events from'},
                {key: 'news_to', label: 'Events to'},
                'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            dates: ['news_from', 'news_to'],
            ordering: 'order',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Calendar', value: 'calendar_data' },
                            { text: 'Events from', value: 'events_from' },
                            { text: 'Events to', value: 'events_to' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Newsletter message calendars'
        }
    }
}
</script>
