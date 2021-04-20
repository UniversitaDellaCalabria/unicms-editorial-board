<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :dates="dates"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'WebpathPublicationNew',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'PublicationEdit',
                            params: { publication_id: item.item.publication.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="arrow-right-circle"
                    variant="secondary"></b-icon>
                Go to publication
            </router-link>
            <router-link :to="{ name: 'WebpathPublicationEdit',
                            params: { site_id: site_id,
                                      webpath_id: webpath_id,
                                      publication_id: item.item.id }}"
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
            api_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/publication-contexts/',
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            fields: [
                'id',
                {key: 'publication.name', label: 'Name'},
                {key: 'publication.title', label: 'Title'},
                'date_start',
                'date_end',
                'in_evidence_start',
                'in_evidence_end',
                'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            dates: ['date_start', 'date_end',
                    'in_evidence_start', 'in_evidence_end'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'publication__name' },
                            { text: 'Title', value: 'publication__title' },
                            { text: 'Date start', value: 'date_start'},
                            { text: 'Date end', value: 'date_end'},
                            { text: 'In evidence start', value: 'in_evidence_start'},
                            { text: 'In evidence end', value: 'in_evidence_end'},
                            { text: 'Order', value: 'order'},
                            { text: 'State', value: 'is_active'}],
            page_title: 'Webpath publications',
        }
    }
}
</script>
