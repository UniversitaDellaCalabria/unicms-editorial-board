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
            <router-link :to="{ name: 'NewsletterMessageAttachmentNew',
                                params: { newsletter_id: newsletter_id,
                                          message_id: message_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #attachment="data">
            <a :href="data.data.value"
               target="_blank"
               :title="data.data.value">
                <b-icon
                    icon="file-text"
                    style="cursor: pointer">
                </b-icon>
            </a>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'NewsletterMessageAttachmentEdit',
                            params: { newsletter_id: newsletter_id,
                                      message_id: message_id,
                                      attachment_id: item.item.id}}"
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
            api_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/'+this.$route.params.message_id+'/attachments/',
            newsletter_id: this.$route.params.newsletter_id,
            message_id: this.$route.params.message_id,
            fields: [
                'id',
                'attachment',
                'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            ordering: 'order',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Attachment', value: 'attachment' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Newsletter message attachments'
        }
    }
}
</script>
