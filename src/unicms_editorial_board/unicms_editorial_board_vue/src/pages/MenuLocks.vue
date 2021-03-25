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
            addNewClass: 'MenuLockNew',
            object_api: '/api/editorial-board/menus/'+this.$route.params.menu_id+'/',
            object_id: this.$route.params.menu_id,
            page_title: 'Menu locks'
        }
    },
}
</script>
