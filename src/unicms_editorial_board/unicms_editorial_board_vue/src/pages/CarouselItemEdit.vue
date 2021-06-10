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
                                <router-link :to="{ name: 'CarouselItemLogs',
                                            params: { carousel_id: carousel_id,
                                                      carousel_item_id: carousel_item_id }}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="clock-history"
                                        variant="secondary"></b-icon>
                                    History
                                </router-link>
                                <router-link :to="{ name: 'CarouselItemLinks',
                                                    params: { carousel_id: carousel_id,
                                                              carousel_item_id: carousel_item_id}}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="link45deg"
                                        variant="secondary"></b-icon>
                                    Links
                                </router-link>
                                <router-link :to="{ name: 'CarouselItemLocalizations',
                                                    params: { carousel_id: carousel_id,
                                                              carousel_item_id: carousel_item_id}}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="flag"
                                        variant="secondary"></b-icon>
                                    Localizations
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
                                :form_source="form_source"
                                :files="files"
                                :add_modal_fields="add_modal_fields" />
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
            carousel_id: this.$route.params.carousel_id,
            carousel_item_id: this.$route.params.carousel_item_id,
            form: {},
            form_source: '/api/editorial-board/carousels/items/form/',
            add_modal_fields: {'image': this.$router.resolve({name: 'MediaNew'}).href},
            files: {},
            page_title: '',
            redis_alert: null,
            interval: null,
        }
    },
    methods: {
        setData(data) {
            for (const [key, value] of Object.entries(data)) {
                this.$set(this.form, key, value)
            }
            this.form.image = data.image.id;
            this.$set(this.files, 'image', data.image.file);
            this.page_title = data.image.title;
            this.$refs.form.getOptionsFromParent('image',
                [{"text": data.image.title,
                  "value": data.image.id}])
        },
        getItem() {
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/items/'+this.carousel_item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.setData(response.data)

                    // concurrency management
                    let obj_content_type = response.data.object_content_type;
                    let api_lock_src = '/api/editorial-board/redis-lock/set/';
                    let params = {'content_type_id': obj_content_type,
                                  'object_id': this.carousel_item_id}
                    this.axios.post(api_lock_src, params,
                                     {headers: {"X-CSRFToken": this.$csrftoken }});
                    this.$user_is_active(api_lock_src, params);
                    this.interval = setInterval(() => {
                        this.$checkForRedisLocks(obj_content_type,
                                                 this.carousel_item_id);
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
        updateMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.files.image = response.data.file
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/items/'+this.carousel_item_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'carousel item edited successfully',
                          dismissable: true }
                    )
                    this.page_title = response.data.image.title;
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
                .delete('/api/editorial-board/carousels/'+this.carousel_id+'/items/'+this.carousel_item_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'carousel item removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'CarouselItems',
                                       params: {carousel_id: this.carousel_id,
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
            this.$bvModal.msgBoxConfirm('Do you want really delete carousel item?', {
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
    },
    watch: {
        'form.image': function(newVal, oldVal){
            if (newVal && newVal!=oldVal) this.updateMedia(newVal);
            if (!newVal) this.files.image = ''
        }
    }
}
</script>
