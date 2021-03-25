<template>
    <CompleteTable
        ref="completeTable"
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :arrays="arrays"
        :arrays_map="arrays_map"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #activation="data">
            <b-icon icon="check-circle-fill"
                variant="success"
                v-if="data.data.value"
                v-on:click="changeStatus(data.data.item)"
                style="cursor: pointer"></b-icon>
            <b-icon icon="dash-circle-fill"
                variant="danger"
                style="cursor: pointer"
                v-on:click="changeStatus(data.data.item)"
                v-else></b-icon>
        </template>

        <template #add_new>
            <router-link :to="{ name: 'PublicationNew'}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'PublicationAttachments',
                                params: { publication_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="file-text"
                    variant="secondary"></b-icon>
                Attachments
            </router-link>
            <router-link :to="{ name: 'PublicationGalleries',
                                params: { publication_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="card-image"
                    variant="secondary"></b-icon>
                Galleries
            </router-link>
            <router-link :to="{ name: 'PublicationLinks',
                                params: { publication_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="link45deg"
                    variant="secondary"></b-icon>
                Links
            </router-link>
            <router-link :to="{ name: 'PublicationLocalizations',
                                params: { publication_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="flag"
                    variant="secondary"></b-icon>
                Localizations
            </router-link>
            <router-link :to="{ name: 'PublicationRelated',
                                params: { publication_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="share"
                    variant="secondary"></b-icon>
                Related publications
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationEdit',
                                params: { publication_id: item.item.id }}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'PublicationLocks',
                                params: { publication_id: item.item.id }}"
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
            api_source: '/api/editorial-board/publications/',
            fields: [
                'id',
                'title',
                'category',
                'relevance',
                {key: 'is_active', label: 'Active'},
                {key: 'childs', label: 'Related'},
                'actions'
            ],
            arrays: ['category'],
            arrays_map: [{'category': 'name'}],
            images: ['presentation_image'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Title', value: 'title' },
                            { text: 'Relevance', value: 'relevance' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Publications',
        }
    },
    methods: {
        changeStatus(item) {
            this.axios
                .get('/api/editorial-board/publications/'+item.id+'/change-status/')
                .then(response => {
                    item.is_active = response.data.is_active;
                    this.$refs.completeTable.alerts.push(
                        { variant: 'success',
                          message: 'status changed successfully',
                          dismissable: true }
                    )}
                )
                .catch(error => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
    }
}
</script>
