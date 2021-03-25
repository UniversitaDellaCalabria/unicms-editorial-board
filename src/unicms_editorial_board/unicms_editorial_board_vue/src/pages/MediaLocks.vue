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
            addNewClass: 'MediaLockNew',
            object_api: '/api/editorial-board/medias/'+this.$route.params.media_id+'/',
            object_id: this.$route.params.media_id,
            page_title: 'Media locks'
        }
    },
}
</script>
