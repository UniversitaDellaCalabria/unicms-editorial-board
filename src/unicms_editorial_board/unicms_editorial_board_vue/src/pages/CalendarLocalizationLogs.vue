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
            api_source: '/api/editorial-board/calendars/'+this.$route.params.calendar_id+'/localizations/'+this.$route.params.calendar_localization_id+'/logs/',
            page_title: 'Calendar localization logs'
        }
    }
}
</script>
