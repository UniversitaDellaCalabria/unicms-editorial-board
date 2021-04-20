<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'WebpathNew',
                                params: { site_id: site_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon> Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'WebpathPages',
                                params: { site_id: site_id,
                                          webpath_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="display"
                    variant="secondary"></b-icon>
                Pages
            </router-link>
            <router-link :to="{ name: 'WebpathPublications',
                                params: { site_id: site_id,
                                          webpath_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="file-text"
                    variant="secondary"></b-icon>
                Publications
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'WebpathEdit',
                            params: { site_id: site_id,
                                      webpath_id: item.item.id}}"
                class="mr-3 btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'WebpathLocks',
                                params: { site_id: site_id,
                                          webpath_id: item.item.id }}"
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
            api_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/',
            fields: [
                'id',
                'name',
                { key: 'get_full_path', label: 'Path'},
                { key: 'is_active', label: 'Active'},
                { key: 'childs', label: 'Related'},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'State', value: 'is_active'}],
            site_id: this.$route.params.site_id,
            page_title: 'Website webpaths'
        }
    }
  }
</script>
