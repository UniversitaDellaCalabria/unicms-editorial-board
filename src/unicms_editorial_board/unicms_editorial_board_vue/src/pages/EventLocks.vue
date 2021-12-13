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
            addNewClass: 'EventLockNew',
            object_api: '/api/editorial-board/events/'+this.$route.params.event_id+'/',
            object_id: this.$route.params.event_id,
            page_title: 'Event locks'
        }
    },
}
</script>
