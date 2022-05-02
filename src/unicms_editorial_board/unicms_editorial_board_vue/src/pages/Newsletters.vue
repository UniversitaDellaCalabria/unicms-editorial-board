<template>
    <CompleteTable
        ref="completeTable"
        :api_source="api_source"
        :fields="fields"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'NewsletterNew'}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'NewsletterMessages',
                                params: { newsletter_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="chat-left-text"
                    variant="secondary"></b-icon>
                Messages
            </router-link>
            <router-link :to="{ name: 'NewsletterSubscriptions',
                                params: { newsletter_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="person-check"
                    variant="secondary"></b-icon>
                Subscriptions
            </router-link>
            <router-link :to="{ name: 'NewsletterTestSubscriptions',
                                params: { newsletter_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="person"
                    variant="secondary"></b-icon>
                Test Subscriptions
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'NewsletterEdit',
                                params: { newsletter_id: item.item.id }}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'NewsletterLocks',
                                params: { newsletter_id: item.item.id }}"
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
            api_source: '/api/editorial-board/newsletters/',
            fields: [
                'id',
                'name',
                { key: 'is_active', label: 'Active'},
                { key: 'childs', label: 'Related'},
                'actions'
            ],
            ordering: 'name',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Newsletters'
        }
    },
}
</script>
