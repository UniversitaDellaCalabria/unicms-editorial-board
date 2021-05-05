<template>
    <ObjectLogs
        :api_source="api_source"
        :page_title="page_title">
    </ObjectLogs>
</template>
<script>
import ObjectLogs from '../layout/ObjectLogs.vue'
export default {
    components: {
        ObjectLogs
    },
    data () {
        return {
            api_source: '/api/editorial-board/menus/'+this.$route.params.menu_id+'/items/'+this.$route.params.menu_item_id+'/localizations/'+this.$route.params.menu_item_localization_id+'/logs/',
            page_title: 'Menu item localization logs'
        }
    }
}
</script>
