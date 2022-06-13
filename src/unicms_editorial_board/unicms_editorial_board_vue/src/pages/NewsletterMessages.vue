<template>
    <CompleteTable
        ref="completeTable"
        :api_source="api_source"
        :dates="dates"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false">

        <template #group_by_categories="data">
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

        <template #discard_sent_news="data">
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

        <template #sending="data">
            <b-icon icon="circle-fill"
                    animation="throb"
                    variant="success"
                    v-if="data.data.value">
            </b-icon>
            <b-icon
                icon="x-circle-fill"
                variant="danger"
                v-else>
            </b-icon>
        </template>

        <template #queued="data">
            <b-icon icon="clock-fill"
                    variant="warning"
                    v-if="data.data.value">
            </b-icon>
            <b-icon
                icon="clock-fill"
                variant="danger"
                v-else>
            </b-icon>
        </template>

        <template #add_new>
            <router-link :to="{ name: 'NewsletterMessageNew',
                                params: { newsletter_id: newsletter_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'NewsletterMessageAttachments',
                                params: { newsletter_id: newsletter_id,
                                          message_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="files"
                    variant="secondary"></b-icon>
                Attachments
            </router-link>
            <router-link :to="{ name: 'NewsletterMessageCategories',
                                params: { newsletter_id: newsletter_id,
                                          message_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="folder2-open"
                    variant="secondary"></b-icon>
                Categories
            </router-link>
            <router-link :to="{ name: 'NewsletterMessagePublicationCtx',
                                params: { newsletter_id: newsletter_id,
                                          message_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="newspaper"
                    variant="secondary"></b-icon>
                News
            </router-link>
            <router-link :to="{ name: 'NewsletterMessagePublications',
                                params: { newsletter_id: newsletter_id,
                                          message_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="file-earmark-text"
                    variant="secondary"></b-icon>
                Publications
            </router-link>
            <router-link :to="{ name: 'NewsletterMessageSendings',
                                params: { newsletter_id: newsletter_id,
                                          message_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="truck"
                    variant="secondary"></b-icon>
                Sendings
            </router-link>
             <router-link :to="{ name: 'NewsletterMessageWebpaths',
                                params: { newsletter_id: newsletter_id,
                                          message_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="diagram3"
                    variant="secondary"></b-icon>
                Webpaths
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'NewsletterMessageEdit',
                            params: { newsletter_id: newsletter_id,
                                      message_id: item.item.id}}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <a :href="item.item.preview" target="_blank" class="btn btn-block btn-sm btn-warning text-white">
                <b-icon icon="eye"
                    variant="white"></b-icon>
                Preview
            </a>
            <b-button
                @click="sendModal(item.item.id, 1)"
                class="btn btn-block btn-sm btn-secondary">
                <b-icon icon="patch-check" variant="white"></b-icon>
                Test
            </b-button>
            <b-button
                @click="sendModal(item.item.id, 0)"
                class="btn btn-block btn-sm btn-success">
                <b-icon icon="truck" variant="white"></b-icon>
                Send
            </b-button>
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
            api_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/',
            newsletter_id: this.$route.params.newsletter_id,
            fields: [
                'id',
                'name',
                {key: 'date_start', label: 'Start'},
                {key: 'date_end', label: 'End'},
                {key: 'group_by_categories', label: 'Group by categories'},
                {key: 'discard_sent_news', label: 'Discard sent news'},
                {key: 'repeat_each', label: 'Repeat each'},
                'template',
                {key: 'is_active', label: 'Active'},
                {key: 'queued'},
                {key: 'sending'},
                { key: 'childs', label: 'Related'},
                'actions'
            ],
            dates: ['date_start', 'date_end'],
            ordering: 'name',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'Start', value: 'date_start' },
                            { text: 'End', value: 'date_end' },
                            { text: 'Group by categories', value: 'group_by_categories' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Newsletter messages',
            check_interval: null
        }
    },
    methods: {
        send(id, test=1){
            this.axios
                .post(this.api_source+id+'/send/',
                      {"test": test},
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'success',
                          message: response.data,
                          dismissable: true }
                    );
                    this.$router.push({name: 'NewsletterMessages',
                                       params: {newsletter_id: this.newsletter_id}})
                                .catch(() => {})
                    }
                )
                .catch(error => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'warning',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        sendModal(id, test=1) {
            let message = 'Do you want really send message?'
            let variant = 'success'

            if(test==1) {
                message = 'Do you want really send test message?'
                variant = 'warning'
            }

            this.$bvModal.msgBoxConfirm(message, {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: variant,
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.send(id, test);
            })
        },
    },
    mounted() {
        // check for update sending status
        this.check_interval = setInterval(() => this.$refs.completeTable.callApi(), 3000);
    },
    beforeDestroy() {
        clearInterval(this.check_interval)
    },
}
</script>
