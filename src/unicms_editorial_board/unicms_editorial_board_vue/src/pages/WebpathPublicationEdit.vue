<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <div class="clearfix mb-5">
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
            publication_id: this.$route.params.publication_id,
            form: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/publication-contexts/form/',
            page_title: '',
            date_fields: ['date_start', 'date_end',
                          'in_evidence_start', 'in_evidence_end'],
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/'+this.publication_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        if(key=='publication') {
                            this.$set(this.form, key, value.id)
                        }
                        else if(key=='webpath') {
                            this.$set(this.form, key, value.id)
                        }
                        else if(this.date_fields.includes(key) && value) {
                            console.log(value)
                            this.$set(this.form, key,
                                      value.substr(0,16).replace("T"," "))
                        }
                        else this.$set(this.form, key, value)
                    }
                    this.page_title = response.data.publication.full_name;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.publication_id)
                    this.$refs.form.getOptionsFromParent('webpath',
                        [{"text": response.data.webpath.full_name,
                          "value": response.data.webpath.id}])
                    this.$refs.form.getOptionsFromParent('publication',
                        [{"text": response.data.publication.full_name,
                          "value": response.data.publication.id}])
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/'+this.publication_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath publication edited successfully',
                          dismissable: true }
                    );
                    this.webpath_id = response.data.webpath.id;
                    this.$router.push({name: 'WebpathPublicationEdit',
                                       params: {site_id: this.site_id,
                                                webpath_id: this.webpath_id,
                                                publication_id: this.publication_id,
                                                alerts: this.alerts}})
                                .catch(() => {})
                    this.page_title = response.data.publication.full_name;
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
        remove() {
            this.axios
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/'+this.publication_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath publication removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'WebpathPublications',
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
        deleteModal() {
            this.$bvModal.msgBoxConfirm('Do you want really delete webpath publication?', {
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
        this.getItem()
    },
}
</script>
