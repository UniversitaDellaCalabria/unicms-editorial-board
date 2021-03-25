<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'CarouselItemLocalizationNew',
                                params: { carousel_id: carousel_id,
                                          carousel_item_id: carousel_item_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'CarouselItemLocalizationEdit',
                            params: { carousel_id: carousel_id,
                                      carousel_item_id: carousel_item_id,
                                      carousel_item_localization_id: item.item.id}}"
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
            api_source: '/api/editorial-board/carousels/'+this.$route.params.carousel_id+'/items/'+this.$route.params.carousel_item_id+'/localizations/',
            carousel_id: this.$route.params.carousel_id,
            carousel_item_id: this.$route.params.carousel_item_id,
            fields: [
                'id',
                'language',
                'pre_heading',
                'heading',,
                'description',
                'order',
                { key: 'is_active', label: 'Active'},
                'actions'
            ],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Language', value: 'language' },
                            { text: 'Pre-Heading', value: 'pre_heading' },
                            { text: 'Heading', value: 'heading' },
                            { text: 'Description', value: 'description' },
                            { text: 'Order', value: 'order'},
                            { text: 'State', value: 'is_active'}],
            page_title: 'Carousel item localizations'
        }
    }
}
</script>
