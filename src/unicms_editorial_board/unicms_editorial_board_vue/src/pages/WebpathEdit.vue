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
                                <router-link :to="{ name: 'WebpathPages',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id }}"
                                    class="btn mx-md-1 btn-sm btn-outline-secondary">
                                    <b-icon icon="display"
                                        variant="secondary"></b-icon>
                                    Pages
                                </router-link>
                                <router-link :to="{ name: 'WebpathPublications',
                                                    params: { site_id: site_id,
                                                              webpath_id: webpath_id }}"
                                    class="btn mx-md-1 btn-sm btn-outline-secondary">
                                    <b-icon icon="file-text"
                                        variant="secondary"></b-icon>
                                    Publications
                                </router-link>
                            </div>
                            <div class="pull-right">
                                <b-button
                                    @click="deleteModal()"
                                    variant="danger"
                                    class="mx-md-1 btn-sm">
                                    <b-icon icon="trash"
                                        variant="white"></b-icon>
                                    Delete
                                </b-button>
                            </div>
                        </div>

                        <b-card-title>{{ page_title }}</b-card-title>

                        <b-card-text>
                            <django-form
                                ref="form"
                                :form="form"
                                :submit="onSubmit"
                                :form_source="form_source" />
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
            form: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/form/',
            page_title: ''
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                    this.page_title = response.data.name;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.webpath_id)
                    if(response.data.alias)
                        this.$refs.form.getOptionsFromParent('alias',
                            [{"text": response.data.alias.name,
                              "value": response.data.alias.id}])
                    if(response.data.parent)
                        this.$refs.form.getOptionsFromParent('parent',
                            [{"text": response.data.parent.name,
                              "value": response.data.parent.id}])
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/';
            event.preventDefault();
            this.axios
                .put(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: response.data.name + ' edited successfully',
                          dismissable: true }
                    )}
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
        remove() {
            this.axios
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'Webpaths',
                                       params: {site_id: this.site_id,
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
        deleteModal() {
            this.$bvModal.msgBoxConfirm('Do you want really delete webpath?', {
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
        }
    },
    mounted() {
        this.getItem();
    }
}
</script>
