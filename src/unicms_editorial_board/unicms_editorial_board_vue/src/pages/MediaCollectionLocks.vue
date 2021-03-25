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
            addNewClass: 'MediaCollectionLockNew',
            object_api: '/api/editorial-board/media-collections/'+this.$route.params.collection_id+'/',
            object_id: this.$route.params.collection_id,
            page_title: 'Media collection locks'
        }
    },
}
</script>
