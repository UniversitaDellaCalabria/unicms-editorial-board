<template>
    <ObjectLocks
        :object_api="object_api"
        :object_id="object_id"
        :page_title="page_title"
        :addNewClass="addNewClass">
    </ObjectLocks>
</template>
<script>
import ObjectLocks from '../layout/ObjectLocks.vue'

export default {
    components: {
        ObjectLocks
    },
    data () {
        return {
            addNewClass: 'CalendarLockNew',
            object_api: '/api/editorial-board/calendars/'+this.$route.params.calendar_id+'/',
            object_id: this.$route.params.calendar_id,
            page_title: 'Calendar locks'
        }
    },
}
</script>
