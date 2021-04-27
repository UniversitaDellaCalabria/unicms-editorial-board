<template>
    <ObjectLogs
        :api_source="api_source"
        :page_title="page_title">
    </ObjectLogs>
</template>
<script>
import ObjectLogs from '../layout/ObjectLogs.vue'
export default {
    components: {
        ObjectLogs
    },
    data () {
        return {
            api_source: '/api/editorial-board/carousels/'+this.$route.params.carousel_id+'/items/'+this.$route.params.carousel_item_id+'/links/'+this.$route.params.carousel_item_link_id+'/localizations/'+this.$route.params.carousel_item_link_localization_id+'/logs/',
            page_title: 'Carousel item link localization logs'
        }
    }
}
</script>
