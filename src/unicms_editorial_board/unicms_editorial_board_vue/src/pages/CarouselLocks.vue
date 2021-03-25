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
            addNewClass: 'CarouselLockNew',
            object_api: '/api/editorial-board/carousels/'+this.$route.params.carousel_id+'/',
            object_id: this.$route.params.carousel_id,
            page_title: 'Carousel locks'
        }
    },
}
</script>
