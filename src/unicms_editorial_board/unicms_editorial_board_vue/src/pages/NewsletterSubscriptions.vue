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
            <router-link :to="{ name: 'NewsletterSubscriptionNew',
                                params: { newsletter_id: newsletter_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #html="data">
            <b-icon
                icon="check-circle-fill"
                variant="success"
                v-if="data.data.value">
            </b-icon>
            <b-icon
                icon="x-circle-fill"
                variant="danger"
                v-else>
            </b-icon>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'NewsletterSubscriptionEdit',
                            params: { newsletter_id: newsletter_id,
                                      subscription_id: item.item.id}}"
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
            api_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/subscriptions/',
            newsletter_id: this.$route.params.newsletter_id,
            fields: [
                'id',
                'email',
                {key: 'first_name', label: 'Name'},
                {key: 'last_name', label: 'Surname'},
                'html',
                {key: 'date_subscription', label: 'Subscription'},
                {key: 'date_unsubscription', label: 'Unsubscription'},
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            dates: ['date_subscription', 'date_unsubscription'],
            ordering: 'email',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'first_name' },
                            { text: 'Surname', value: 'last_name' },
                            { text: 'Email', value: 'email' },
                            { text: 'HTML', value: 'html' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Newsletter subscriptions'
        }
    }
}
</script>
