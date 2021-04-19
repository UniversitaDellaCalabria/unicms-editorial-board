<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <div class="clearfix mb-5">
                            <div class="pull-left">
                                <router-link :to="{ name: 'WebpathPageBlocks',
                                                params: { site_id: site_id,
                                                          webpath_id: webpath_id,
                                                          page_id: page_id }}"
                                class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="box-seam"
                                        variant="secondary"></b-icon>
                                    Blocks
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageCarousels',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="collection-play"
                                        variant="secondary"></b-icon>
                                    Carousels
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageLinks',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="link45deg"
                                        variant="secondary"></b-icon>
                                    Links
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageLocalizations',
                                                params: { site_id: site_id,
                                                          webpath_id: webpath_id,
                                                          page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="flag"
                                        variant="secondary"></b-icon>
                                    Localizations
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageMedia',
                                                params: { site_id: site_id,
                                                          webpath_id: webpath_id,
                                                          page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="card-image"
                                        variant="secondary"></b-icon>
                                    Media
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageMediaCollections',
                                                params: { site_id: site_id,
                                                          webpath_id: webpath_id,
                                                          page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="images"
                                        variant="secondary"></b-icon>
                                    Galleries
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageMenus',
                                                params: { site_id: site_id,
                                                          webpath_id: webpath_id,
                                                          page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="menu-button-wide-fill"
                                        variant="secondary"></b-icon>
                                    Menu
                                </router-link>
                                <router-link :to="{ name: 'WebpathPagePublications',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="file-text"
                                        variant="secondary"></b-icon>
                                    Publications
                                </router-link>
                                <router-link :to="{ name: 'WebpathPageRelated',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id,
                                                              page_id: page_id }}"
                                    class="btn btn-outline-secondary mx-md-1 btn-sm">
                                    <b-icon icon="share"
                                        variant="secondary"></b-icon>
                                    Related pages
                                </router-link>
                            </div>

                            <div class="pull-right">
                                <b-button
                                    v-if="is_active"
                                    @click="toggleIsActiveModal()"
                                    variant="danger"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="x-circle"></b-icon>
                                    Deactivate
                                </b-button>
                                <b-button
                                    v-else
                                    @click="toggleIsActiveModal()"
                                    variant="success"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="check-circle"></b-icon>
                                    Activate
                                </b-button>
                                <b-button
                                    v-if="published === 'draft'"
                                    @click="togglePublishModal()"
                                    variant="success"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="check-circle"></b-icon>
                                    Publish
                                </b-button>
                                <b-button
                                    v-else-if="published === 'published'"
                                    @click="togglePublishModal()"
                                    variant="info"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="x-circle"></b-icon>
                                    Make it draft
                                </b-button>
                                <b-button
                                    :href="preview_url"
                                    target="_blank"
                                    variant="secondary"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="eye"></b-icon>
                                    Preview
                                </b-button>
                                <b-button
                                    @click="copyAsDraftModal()"
                                    variant="warning text-white"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon
                                        icon="files"
                                        variant="white">
                                    </b-icon>
                                    Copy as draft
                                </b-button>
                                <b-button
                                    @click="deleteModal()"
                                    variant="danger"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="trash"
                                        variant="white"></b-icon>
                                    Delete
                                </b-button>
                            </div>

                        </div>
                        <b-card-title>{{ page_title }}</b-card-title>

                        <b-card-text>
                            <p>
                                <b>Activation status: </b>
                                <b-icon
                                    icon="circle-fill"
                                    font-scale="0.8"
                                    variant="success"
                                    v-if="is_active">
                                </b-icon>
                                <b-icon
                                    icon="circle-fill"
                                    font-scale="0.8"
                                    variant="danger"
                                    v-else>
                                </b-icon>
                                <br>
                                <b>Publication status: </b>
                                <b-icon
                                    icon="circle-fill"
                                    font-scale="0.8"
                                    variant="success"
                                    v-if="published === 'published'">
                                </b-icon>
                                <b-icon
                                    icon="circle-fill"
                                    font-scale="0.8"
                                    variant="warning"
                                    v-else-if="published === 'draft'">
                                </b-icon>
                            </p>
                            <hr />
                            <django-form
                                ref="form"
                                :form="form"
                                :files="files"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :tag_fields="tag_fields" />
                        </b-card-text>
                    </b-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alerts: [],
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            page_id: this.$route.params.page_id,
            form: {},
            files: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/pages/form/',
            tag_fields: ['tags'],
            page_title: '',
            preview_url: '',
            is_active: false,
            published: '',
            date_fields: ['date_start', 'date_end'],
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        if(key=='base_template' || key=='webpath') {
                            this.$set(this.form, key, value.id)
                        }
                        else if(this.date_fields.includes(key) && value) {
                            this.$set(this.form, key,
                                      value.substr(0,16).replace("T"," "))
                        }
                        else this.$set(this.form, key, value)
                        this.$set(this.files, 'base_template', response.data.base_template.image);
                        this.page_title = response.data.name;
                        this.preview_url = response.data.preview_url;
                        this.is_active = response.data.is_active;
                        this.published = response.data.state;
                        this.$checkForRedisLocks(response.data.object_content_type,
                                                 this.page_id)
                        this.$refs.form.getOptionsFromParent('webpath',
                            [{"text": response.data.webpath.name,
                              "value": response.data.webpath.id}])
                    }
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page edited successfully',
                          dismissable: true }
                    );
                    this.webpath_id = response.data.webpath.id;
                    this.$router.push({name: 'WebpathPageEdit',
                                       params: {site_id: this.site_id,
                                                webpath_id: this.webpath_id,
                                                page_id: this.page_id,
                                                alerts: this.alerts}})
                    }
                )
                .catch(error => {
                    for (var key in error.response.data) {
                        this.alerts.push(
                            { variant: 'danger',
                              message: key + ': ' + error.response.data[key],
                              dismissable: true }
                        )
                    }
                })
        },
        copyAsDraft(){
            this.axios
                .get('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/copy-as-draft/')
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath page copied as draft successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'WebpathPages',
                                       params: {site_id: this.site_id,
                                                webpath_id: this.webpath_id,
                                                alerts: this.alerts}})
                    }
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        toggleIsActive() {
            this.axios
                .get('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/change-status/')
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'status updated successfully',
                          dismissable: true }
                    );
                    this.is_active = response.data.is_active;
                    }
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        togglePublish() {
            this.axios
                .get('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/change-publication-status/')
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication status updated successfully',
                          dismissable: true }
                    );
                    this.published = response.data.state;
                    }
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        remove() {
            this.axios
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'WebpathPages',
                                       params: {site_id: this.site_id,
                                                webpath_id: this.webpath_id,
                                                alerts: this.alerts}})
                    }
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        copyAsDraftModal() {
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
                if (value) this.copyAsDraft();
            })
        },
        toggleIsActiveModal() {
            this.$bvModal.msgBoxConfirm('Do you want really change activation status?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.toggleIsActive();
            })
        },
        togglePublishModal() {
            this.$bvModal.msgBoxConfirm('Do you want really change publication status?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.togglePublish();
            })
        },
        deleteModal() {
            this.$bvModal.msgBoxConfirm('Do you want really delete page?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.remove();
            })
        },
        updateMedia(val) {
            let source = '/api/editorial-board/page-templates/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.files.base_template = response.data.image
                })
        },
    },
    mounted() {
        this.getItem()
    },
    watch: {
        'form.base_template': function(newVal, oldVal){
            if (newVal && newVal!=oldVal) this.updateMedia(newVal);
            if (!newVal) this.files.base_template = '';
        }
    }
}
</script>
