<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :images="images"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #text>
            <p>
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit
                anim id est laborum."
            </p>

            <div class="accordion" role="tablist">
                <b-button block v-b-toggle.accordion-1 variant="info">
                    Template default blocks
                </b-button>
                <b-collapse
                    id="accordion-1"
                    accordion="blocks-accordion"
                    role="tabpanel">
                    <b-table
                        ref="table"
                        id="blocks-table"
                        striped hover responsive
                        :busy="isBusy2"
                        :fields="template_blocks_fields"
                        :items="template_blocks_items"
                        class="mt-1">
                        <template #cell(block.image)="data">
                            <b-img
                                v-if="data.value"
                                :src="data.value.file || data.value"
                                fluid
                                alt="Responsive image">
                            </b-img>
                        </template>
                </b-collapse>
            </div>
            <hr class="my-3" />
        </template>

        <template #add_new>
            <router-link :to="{ name: 'WebpathPageBlockNew',
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
            <router-link :to="{ name: 'WebpathPageBlockEdit',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: page_id,
                                          block_id: item.item.id }}"
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
            api_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/'+this.$route.params.page_id+'/blocks/',
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            page_id: this.$route.params.page_id,
            fields: [
                'id',
                {key: 'block.name', label: 'Block'},
                {key: 'block.image', label: 'Image'},
                'section',
                {key: 'block.description', label: 'Description'},
               'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            images: ['block.image'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'block__name' },
                            { text: 'Section', value: 'section' },
                            { text: 'Description', value: 'block__description' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Page blocks',
            template_blocks_fields: [
                {key: 'block.name', label: 'Block'},
                {key: 'block.image', label: 'Image'},
                {key: 'section'},
                {key: 'order'},
                {key: 'block.description', label: 'Description'}
            ],
            isBusy2: true,
            template_blocks_items: [],
        }
    },
    methods: {
        getTemplateBlocks() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    let template_id = response.data.base_template.id;
                    let source = '/api/editorial-board/templates/'+template_id+'/blocks/';
                    this.axios
                        .get(source)
                        .then(response => {
                            this.template_blocks_items = response.data;
                            this.isBusy2 = false;
                        })
                })
        },
    },
    mounted() {
        this.getTemplateBlocks();
    }
}
</script>
