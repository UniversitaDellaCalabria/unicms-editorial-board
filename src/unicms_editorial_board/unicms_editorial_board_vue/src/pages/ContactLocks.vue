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
            addNewClass: 'ContactLockNew',
            object_api: '/api/editorial-board/contacts/'+this.$route.params.contact_id+'/',
            object_id: this.$route.params.contact_id,
            page_title: 'Contact locks'
        }
    },
}
</script>
