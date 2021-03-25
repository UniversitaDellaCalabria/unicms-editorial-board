<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #add_new>
            <router-link :to="{ name: 'CarouselItemNew',
                                params: { carousel_id: carousel_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'CarouselItemLinks',
                            params: { carousel_id: carousel_id,
                                      carousel_item_id: item.item.id}}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="link45deg"
                    variant="secondary"></b-icon>
                Links
            </router-link>
            <router-link :to="{ name: 'CarouselItemLocalizations',
                            params: { carousel_id: carousel_id,
                                      carousel_item_id: item.item.id}}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="flag"
                    variant="secondary"></b-icon>
                Localizations
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'CarouselItemEdit',
                            params: { carousel_id: carousel_id,
                                      carousel_item_id: item.item.id}}"
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
            api_source: '/api/editorial-board/carousels/'+this.$route.params.carousel_id+'/items/',
            carousel_id: this.$route.params.carousel_id,
            fields: [
                'id',
                {key: 'image', thClass: 'w-25'},
                'pre_heading',
                'heading',
                'order',
                {key: 'is_active', label: 'Active'},
                {key: 'childs', label: 'Related'},
                'actions'
            ],
            images: ['image'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Pre-Heading', value: 'pre_heading' },
                            { text: 'Heading', value: 'heading' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Carousel items'
        }
    }
}
</script>
