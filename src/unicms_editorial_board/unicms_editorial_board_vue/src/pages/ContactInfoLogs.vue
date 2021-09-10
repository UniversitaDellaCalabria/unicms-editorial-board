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
            api_source: '/api/editorial-board/contacts/'+this.$route.params.contact_id+'/infos/'+this.$route.params.contact_info_id+'/logs/',
            page_title: 'Contact information logs'
        }
    }
}
</script>
