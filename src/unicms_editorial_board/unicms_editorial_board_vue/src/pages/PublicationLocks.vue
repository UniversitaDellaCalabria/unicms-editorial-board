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
            addNewClass: 'PublicationLockNew',
            object_api: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/',
            object_id: this.$route.params.publication_id,
            page_title: 'Publication locks'
        }
    },
}
</script>
