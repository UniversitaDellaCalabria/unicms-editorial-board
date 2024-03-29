<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" :redis_alert="redis_alert" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <div class="clearfix mb-5">
                            <div class="pull-left">
                                <router-link :to="{ name: 'WebpathPublicationLogs',
                                            params: { site_id: site_id,
                                                      webpath_id: webpath_id,
                                                      publication_id: publication_id }}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="clock-history"
                                        variant="secondary"></b-icon>
                                    History
                                </router-link>
                                <router-link :to="{ name: 'PublicationEdit',
                                                    params: { publication_id: publication_pub_ref }}"
                                    class="btn mx-md-1 btn-sm btn-outline-secondary">
                                    <b-icon icon="arrow-right-circle"
                                        variant="secondary"></b-icon>
                                    Go to publication
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
            publication_id: this.$route.params.publication_id,
            publication_pub_ref: '',
            form: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/publication-contexts/form/',
            page_title: '',
            date_fields: ['date_start', 'date_end',
                          'in_evidence_start', 'in_evidence_end'],
            redis_alert: null,
            interval: null,
        }
    },
    methods: {
        setData(data) {
            for (const [key, value] of Object.entries(data)) {
                if(key=='publication' && value) {
                    this.$set(this.form, key, value.id)
                }
                else if(key=='webpath' && value) {
                    this.$set(this.form, key, value.id)
                }
                else if(this.date_fields.includes(key) && value) {
                    this.$set(this.form, key,
                              value.substr(0,16).replace("T"," "))
                }
                else this.$set(this.form, key, value)
            }

            if(data.publication) {
                this.publication_pub_ref = data.publication.id;
                this.page_title = data.publication.full_name;
                this.$refs.form.getOptionsFromParent('publication',
                [{"text": data.publication.full_name,
                  "value": data.publication.id}])
            }

            if(data.webpath)
                this.$refs.form.getOptionsFromParent('webpath',
                    [{"text": data.webpath.full_name,
                      "value": data.webpath.id}])

        },
        getItem() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/publication-contexts/'+this.publication_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.setData(response.data)

                    // concurrency management
                    let obj_content_type = response.data.object_content_type;
                    let api_lock_src = '/api/editorial-board/redis-lock/set/';
                    let params = {'content_type_id': obj_content_type,
                                  'object_id': this.publication_id}
                    this.axios.post(api_lock_src, params,
                                     {headers: {"X-CSRFToken": this.$csrftoken }});
                    this.$user_is_active(api_lock_src, params);
                    this.interval = setInterval(() => {
                        this.$checkForRedisLocks(obj_content_type,
                                                 this.publication_id);
                        // update concurrent form data
                        if (this.redis_alert) {
                            this.axios
                                .get(source)
                                .then(new_response => {
                                    this.setData(new_response.data)
                                }
                            )
                        }
                    }, this.$redis_ttl)
                    // end concurrency management
                })
        },
        onSubmit(event) {
            this.$refs.form.loading = true;
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
                    this.$refs.form.loading = false
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
                    this.$refs.form.loading = false
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
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>
