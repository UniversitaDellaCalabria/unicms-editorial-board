<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" :redis_alert="redis_alert" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <div class="clearfix">
                            <div class="pull-right">
                                <b-button
                                    @click="deleteModal()"
                                    variant="danger"
                                    class="mx-md-1 btn-sm">
                                    <b-icon icon="trash"
                                        variant="white"></b-icon>
                                    Delete
                                </b-button>
                                <a :href="preview" target="_blank" class="btn btn-sm btn-warning text-white mx-md-1">
                                    <b-icon icon="eye"
                                        variant="white"></b-icon>
                                    Preview
                                </a>
                                <b-button
                                    @click="sendModal(message_id, 1)"
                                    class="btn btn-sm btn-secondary mx-md-1">
                                    <b-icon icon="patch-check" variant="white"></b-icon>
                                    Test
                                </b-button>
                                <b-button
                                    @click="sendModal(message_id, 0)"
                                    class="btn btn-sm btn-success mx-md-1">
                                    <b-icon icon="truck" variant="white"></b-icon>
                                    Send
                                </b-button>
                            </div>
                        </div>
                        <hr />
                        <div class="clearfix mb-5">
                            <router-link :to="{ name: 'NewsletterMessageAttachments',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="files"
                                    variant="secondary"></b-icon>
                                Attachments
                            </router-link>
                            <router-link :to="{ name: 'NewsletterMessageCalendars',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="calendar2-date"
                                    variant="secondary"></b-icon>
                                Calendars
                            </router-link>
                            <router-link :to="{ name: 'NewsletterMessageCategories',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="folder2-open"
                                    variant="secondary"></b-icon>
                                Categories
                            </router-link>
                            <router-link :to="{ name: 'NewsletterMessagePublicationCtx',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="newspaper"
                                    variant="secondary"></b-icon>
                                News
                            </router-link>
                            <router-link :to="{ name: 'NewsletterMessagePublications',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="file-earmark-text"
                                    variant="secondary"></b-icon>
                                Publications
                            </router-link>
                            <router-link :to="{ name: 'NewsletterMessageSendings',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="truck"
                                    variant="secondary"></b-icon>
                                Sendings
                            </router-link>
                             <router-link :to="{ name: 'NewsletterMessageWebpaths',
                                                params: { newsletter_id: newsletter_id,
                                                          message_id: message_id }}"
                                class="btn btn-sm btn-outline-secondary mx-md-1">
                                <b-icon icon="diagram3"
                                    variant="secondary"></b-icon>
                                Webpaths
                            </router-link>
                        </div>


                        <b-card-title>
                            {{ page_title }}
                            <small v-if="queued">
                                <br>
                                - queued: <b-icon icon="clock-fill" variant="warning"></b-icon>
                            </small>
                            <small v-if="queued_test">
                                <br>
                                - test queued: <b-icon icon="clock-fill" variant="warning"></b-icon>
                            </small>
                            <small v-if="sending">
                                <br>
                                - sending: <b-icon icon="circle-fill" animation="throb" variant="success"></b-icon>
                            </small>
                            <small v-if="sending_test">
                                <br>
                                - test sending: <b-icon icon="circle-fill" animation="throb" variant="success"></b-icon>
                            </small>
                        </b-card-title>

                        <b-card-text>
                            <django-form
                                ref="form"
                                :form="form"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :files="files"
                                :rich_text_fields="rich_text_fields" />
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
            form: {},
            form_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/form/',
            files: {},
            page_title: '',
            preview: '',
            redis_alert: null,
            sending: false,
            sending_test: false,
            queued: false,
            queued_test: false,
            interval: null,
            check_status: null,
            rich_text_fields: ['content', 'intro_text', 'footer_text'],
            date_fields: ['date_start', 'date_end'],
        }
    },
    methods: {
        setData(data) {
            for (const [key, value] of Object.entries(data)) {
                if(key=='sending') {
                    this.sending = data.sending
                }
                else if(this.date_fields.includes(key) && value) {
                    this.$set(this.form, key,
                              value.substr(0,16).replace("T"," "))
                }
                else if(key=='week_day' && value) {
                    this.$set(this.form, key, value.split(","))
                }
                else this.$set(this.form, key, value)

                this.preview = data.preview;
                this.page_title = data.name;
                this.$set(this.files, 'banner', data.banner);
                this.$delete(this.form, 'banner');
            }
        },
        getItem() {
            let source = '/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.setData(response.data)

                    // concurrency management
                    let obj_content_type = response.data.object_content_type;
                    let api_lock_src = '/api/editorial-board/redis-lock/set/';
                    let params = {'content_type_id': obj_content_type,
                                  'object_id': this.message_id}
                    this.axios.post(api_lock_src, params,
                                     {headers: {"X-CSRFToken": this.$csrftoken }});
                    this.$user_is_active(api_lock_src, params);

                    this.interval = setInterval(() => {
                        this.$checkForRedisLocks(obj_content_type,
                                                 this.message_id);
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

                    this.check_status = setInterval(() => {
                        this.axios
                            .get(source)
                            .then(new_response => {
                                this.queued = new_response.data.queued
                                this.queued_test = new_response.data.queued_test
                                this.sending = new_response.data.sending
                                this.sending_test = new_response.data.sending_test
                            }
                        )
                    }, 2000)

                })
        },
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/';
            event.preventDefault();
            const formData = new FormData();
            for ( var key in this.form ) {
                if(this.form[key] || this.form[key] == false){
                    formData.append(key, this.form[key]);
                }
                else formData.append(key, '');
            };
            this.axios
                .patch(source, formData,
                       {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'newsletter message edited successfully',
                          dismissable: true }
                    )
                    this.page_title = response.data.name;
                    this.$refs.form.loading = false;
                    this.$set(this.files, 'banner', response.data.banner);
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
                .delete('/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'newsletter message removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'NewsletterMessages',
                                       params: {newsletter_id: this.newsletter_id,
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
            this.$bvModal.msgBoxConfirm('Do you want really delete message?', {
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
        send(id, test=1){
            this.axios
                .post('/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/send/',
                      {"test": test},
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: response.data,
                          dismissable: true }
                    );
                    this.$router.push({name: 'NewsletterMessageEdit',
                                       params: {newsletter_id: this.newsletter_id,
                                                message_id: this.message_id,
                                                alerts: this.alerts}})
                                .catch(() => {})
                })
                .catch(error => {
                    this.alerts.push(
                        { variant: 'warning',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        sendModal(id, test=1) {
            let message = 'Do you want really send message?'
            let variant = 'success'

            if(test==1) {
                message = 'Do you want really send test message?'
                variant = 'warning'
            }

            this.$bvModal.msgBoxConfirm(message, {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: variant,
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.send(id, test);
            })
        },
    },
    mounted() {
        this.getItem()
    },
    beforeDestroy() {
        clearInterval(this.interval)
        clearInterval(this.check_status)
    },
}
</script>
