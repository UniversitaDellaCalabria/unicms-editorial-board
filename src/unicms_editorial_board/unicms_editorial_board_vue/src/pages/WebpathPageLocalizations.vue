<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false">

        <template #add_new>
            <router-link :to="{ name: 'WebpathPageLocalizationNew',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: page_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'WebpathPageLocalizationEdit',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: page_id,
                                          localization_id: item.item.id }}"
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
            api_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/'+this.$route.params.page_id+'/localizations/',
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            page_id: this.$route.params.page_id,
            fields: [
                'id',
                'language',
                'title',
                {key: 'is_active', sortable: true},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Language', value: 'language' },
                            { text: 'Title', value: 'title' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Page localizations',
        }
    }
}
</script>
