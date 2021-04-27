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
            api_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/attachments/'+this.$route.params.attachment_id+'/logs/',
            page_title: 'Publication attachment logs'
        }
    }
}
</script>
