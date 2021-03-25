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
            addNewClass: 'WebpathLockNew',
            object_api: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/',
            object_id: this.$route.params.webpath_id,
            page_title: 'Webpath locks'
        }
    },
}
</script>
