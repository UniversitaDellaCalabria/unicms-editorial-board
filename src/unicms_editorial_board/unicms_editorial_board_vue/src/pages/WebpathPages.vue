<template>
    <CompleteTable
        ref="completeTable"
        :api_source="api_source"
        :dates="dates"
        :fields="fields"
        :images="images"
        :arrays="arrays"
        :arrays_map="arrays_map"
        :ordering_list="ordering_list"
        :page_title="page_title">

        <template #activation="data">
            <b-icon
                icon="check-circle-fill"
                variant="success"
                v-if="data.data.value"
                v-on:click="changeStatus(data.data.item)"
                style="cursor: pointer">
            </b-icon>
            <b-icon
                icon="dash-circle-fill"
                variant="danger"
                style="cursor: pointer"
                v-on:click="changeStatus(data.data.item)"
                v-else>
            </b-icon>
        </template>

        <template #state="data">
            <b-icon
                icon="check-circle-fill"
                variant="success"
                v-on:click="publishUnpublish(data.data.item)"
                v-if="data.data.value == 'published'"
                style="cursor: pointer">
            </b-icon>
            <b-icon
                icon="exclamation-triangle-fill"
                variant="warning"
                v-on:click="publishUnpublish(data.data.item)"
                style="cursor: pointer"
                v-else>
            </b-icon>
        </template>

        <template #add_new>
            <router-link :to="{ name: 'WebpathPageNew',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'WebpathPageBlocks',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="box-seam"
                    variant="secondary"></b-icon>
                Blocks
            </router-link>
            <router-link :to="{ name: 'WebpathPageCarousels',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="collection-play"
                    variant="secondary"></b-icon>
                Carousels
            </router-link>
            <router-link :to="{ name: 'WebpathPageLinks',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="link45deg"
                    variant="secondary"></b-icon>
                Links
            </router-link>
            <router-link :to="{ name: 'WebpathPageLocalizations',
                            params: { site_id: site_id,
                                      webpath_id: webpath_id,
                                      page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="flag"
                    variant="secondary"></b-icon>
                Localizations
            </router-link>
            <router-link :to="{ name: 'WebpathPageMedia',
                            params: { site_id: site_id,
                                      webpath_id: webpath_id,
                                      page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="card-image"
                    variant="secondary"></b-icon>
                Media
            </router-link>
            <router-link :to="{ name: 'WebpathPageMediaCollections',
                            params: { site_id: site_id,
                                      webpath_id: webpath_id,
                                      page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="images"
                    variant="secondary"></b-icon>
                Galleries
            </router-link>
            <router-link :to="{ name: 'WebpathPageMenus',
                            params: { site_id: site_id,
                                      webpath_id: webpath_id,
                                      page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="menu-button-wide-fill"
                    variant="secondary"></b-icon>
                Menu
            </router-link>
            <router-link :to="{ name: 'WebpathPagePublications',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="file-text"
                    variant="secondary"></b-icon>
                Publications
            </router-link>
            <router-link :to="{ name: 'WebpathPageRelated',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="share"
                    variant="secondary"></b-icon>
                Related pages
            </router-link>
        </template>

        <template #actions="item">
            <b-button
                :href="item.item.preview_url"
                target="_blank"
                class="btn btn-block btn-sm btn-secondary text-white">
                <b-icon icon="eye"
                    variant="white"></b-icon>
                Preview
            </b-button>
            <b-button
                @click="copyAsDraftModal(item.item.id)"
                class="btn btn-block btn-sm btn-warning text-white">
                <b-icon icon="files"
                    variant="white"></b-icon>
                Copy as draft
            </b-button>
            <router-link :to="{ name: 'WebpathPageEdit',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'WebpathPageLocks',
                                params: { site_id: site_id,
                                          webpath_id: webpath_id,
                                          page_id: item.item.id }}"
                class="btn btn-block btn-sm btn-secondary">
                <b-icon icon="lock"
                    variant="white"></b-icon>
                Allowed users
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
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            api_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/',
            fields: [
                'id',
                {key: 'name', label: 'Name'},
                {key: 'title', label: 'Title'},
                {key: 'base_template.name', label: 'Template'},
                {key: 'base_template.image', label: 'Image'},
                'date_start',
                'date_end',
                'type',
                {key: 'state', label: 'Published'},
                {key: 'is_active', label: 'Active'},
                {key: 'childs', label: 'Related'},
                'actions'
            ],
            dates: ['date_start', 'date_end'],
            images: ['base_template.image'],
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Name', value: 'name' },
                            { text: 'Title', value: 'title' },
                            { text: 'Date start', value: 'date_start' },
                            { text: 'Date end', value: 'date_end' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Webpath pages',
        }
    },
    methods: {
        copyAsDraft(id){
            this.axios
                .get(this.api_source+id+'/copy-as-draft/')
                .then(response => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'success',
                          message: 'webpath page copied as draft successfully',
                          dismissable: true }
                    );
                    this.$refs.completeTable.callApi();
                    }
                )
                .catch(error => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        copyAsDraftModal(id) {
            this.$bvModal.msgBoxConfirm('Do you want really copy webpath page as draft?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'warning',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.copyAsDraft(id);
            })
        },
        changeStatus(item) {
            this.axios
                .get(this.api_source+item.id+'/change-status/')
                .then(response => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'success',
                          message: 'webpath page status changed successfully',
                          dismissable: true }
                    );
                    item.is_active = response.data.is_active;
                    }
                )
                .catch(error => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        publishUnpublish(item) {
            this.axios
                .get(this.api_source+item.id+'/change-publication-status/')
                .then(response => {
                    let published = this.$refs.completeTable.items.find(published => published.id === item.draft_of);
                    item.state = response.data.state;
                    item.is_active = response.data.is_active;
                    item.draft_of = response.data.draft_of;
                    if (published)
                        published.is_active = false;
                    this.$refs.completeTable.alerts.push(
                        { variant: 'success',
                          message: 'webpath page publication status changed successfully',
                          dismissable: true }
                    )}
                )
                .catch(error => {
                    this.$refs.completeTable.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        }
    }
}
</script>
