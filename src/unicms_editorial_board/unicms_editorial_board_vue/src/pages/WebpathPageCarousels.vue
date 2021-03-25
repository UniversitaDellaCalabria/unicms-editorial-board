<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'WebpathPageCarouselNew',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: page_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'CarouselEdit',
                                params: { carousel_id: item.item.carousel.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="arrow-right-circle"
                    variant="secondary"></b-icon>
                Go to carousel
            </router-link>
            <router-link :to="{ name: 'WebpathPageCarouselEdit',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: page_id,
                                          carousel_id: item.item.id }}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
        </template>

    </CompleteTable>
</template>
<script>
import CompleteTable from '../layout/CompleteTable.vue'

export default {
    components: {
        CompleteTable
    },
    data () {
        return {
            api_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/'+this.$route.params.page_id+'/carousels/',
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            page_id: this.$route.params.page_id,
            fields: [
                'id',
                {key: 'carousel.name', label: 'Carousel'},
                'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'carousel__name' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Page carousels',
        }
    }
}
</script>
