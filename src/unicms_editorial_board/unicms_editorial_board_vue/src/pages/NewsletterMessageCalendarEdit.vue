<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" :redis_alert="redis_alert" />

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
                                :form_source="form_source"
                                :files="files" />
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
            newsletter_id: this.$route.params.newsletter_id,
            message_id: this.$route.params.message_id,
            calendar_id: this.$route.params.calendar_id,
            form: {},
            form_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/'+this.$route.params.message_id+'/calendars/form/',
            files: {},
            page_title: '',
            redis_alert: null,
            interval: null,
            date_fields: ['events_from', 'events_to'],
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

            this.$refs.form.getOptionsFromParent('calendar_context',
                [{"text": data.calendar_data,
                  "value": data.calendar_context }])
        },
        getItem() {
            let source = '/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/calendars/'+this.calendar_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.setData(response.data)

                    // concurrency management
                    let obj_content_type = response.data.object_content_type;
                    let api_lock_src = '/api/editorial-board/redis-lock/set/';
                    let params = {'content_type_id': obj_content_type,
                                  'object_id': this.calendar_id}
                    this.axios.post(api_lock_src, params,
                                     {headers: {"X-CSRFToken": this.$csrftoken }});
                    this.$user_is_active(api_lock_src, params);
                    this.interval = setInterval(() => {
                        this.$checkForRedisLocks(obj_content_type,
                                                 this.calendar_id);
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
            let source = '/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/calendars/'+this.calendar_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'calendar edited successfully',
                          dismissable: true }
                    )
                    this.page_title = response.data.email;
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
                .delete('/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/calendars/'+this.calendar_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'calendar removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'NewsletterMessageCalendars',
                                       params: {newsletter_id: this.newsletter_id,
                                                message_id: this.message_id,
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
            this.$bvModal.msgBoxConfirm('Do you want really delete calendar?', {
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
