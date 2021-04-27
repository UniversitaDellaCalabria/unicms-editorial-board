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
            api_source: '/api/editorial-board/media-collections/'+this.$route.params.collection_id+'/items/'+this.$route.params.collection_item_id+'/logs/',
            page_title: 'Media Collection item logs'
        }
    }
}
</script>
