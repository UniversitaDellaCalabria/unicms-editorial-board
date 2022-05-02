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
            addNewClass: 'NewsletterLockNew',
            object_api: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/',
            object_id: this.$route.params.newsletter_id,
            page_title: 'Newsletter locks'
        }
    },
}
</script>
