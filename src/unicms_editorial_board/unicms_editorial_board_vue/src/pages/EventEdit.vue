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
                                <router-link :to="{ name: 'EventLogs',
                                            params: { event_id: event_id }}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="clock-history"
                                        variant="secondary"></b-icon>
                                    History
                                </router-link>
                                <router-link :to="{ name: 'PublicationEdit',
                                                    params: { publication_id: publication_ref }}"
                                    class="btn mx-md-1 btn-sm btn-outline-secondary">
                                    <b-icon icon="arrow-right-circle"
                                        variant="secondary"></b-icon>
                                    Go to publication
                                </router-link>
                                <router-link :to="{ name: 'EventLocks',
                                            params: { event_id: event_id }}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="lock"
                                        variant="secondary"></b-icon>
                                    Allowed users
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
                                :form="this.form"
                                :submit="onSubmit"
                                :add_modal_fields="add_modal_fields"
                                :form_source="this.form_source" />
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
            event_id: this.$route.params.event_id,
            form: {},
            form_source: '/api/editorial-board/events/form/',
            page_title: '',
            publication_ref: '',
            redis_alert: null,
            interval: null,
            date_fields: ['date_start', 'date_end'],
            add_modal_fields: {'publication':  this.$router.resolve({name: 'PublicationNew'}).href},
        }
    },
    methods: {
        setData(data) {
            for (const [key, value] of Object.entries(data)) {
                if(this.date_fields.includes(key) && value) {
                    this.$set(this.form, key,
                              value.substr(0,16).replace("T"," "))
                }
                else this.$set(this.form, key, value)
            }
            this.page_title = data.publication_data.title;
            this.publication_ref = data.publication_data.id;
            this.$refs.form.getOptionsFromParent('publication',
                [{"text": data.publication_data.title,
                  "value": data.publication}])
        },
        getItem() {
            let source = '/api/editorial-board/events/'+this.event_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.setData(response.data)

                    // concurrency management
                    let obj_content_type = response.data.object_content_type;
                    let api_lock_src = '/api/editorial-board/redis-lock/set/';
                    let params = {'content_type_id': obj_content_type,
                                  'object_id': this.event_id}
                    this.axios.post(api_lock_src, params,
                                     {headers: {"X-CSRFToken": this.$csrftoken }});
                    this.$user_is_active(api_lock_src, params);
                    this.interval = setInterval(() => {
                        this.$checkForRedisLocks(obj_content_type,
                                                 this.event_id);
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
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/events/'+this.event_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.page_title = response.data.name;
                    this.alerts.push(
                        { variant: 'success',
                          message: 'event edited successfully',
                          dismissable: true }
                    )
                    this.$refs.form.loading = false;
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
                    this.$refs.form.loading = false;
                })
        },
        remove() {
            this.axios
                .delete('/api/editorial-board/events/'+this.event_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'event removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'Events',
                                       params: {alerts: this.alerts}})
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
            this.$bvModal.msgBoxConfirm('Do you want really delete event?', {
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
    },
    mounted() {
        this.getItem();
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>
