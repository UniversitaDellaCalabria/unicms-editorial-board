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
                                <router-link :to="{ name: 'MenuLogs',
                                                    params: { menu_id: menu_id }}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="clock-history"
                                        variant="secondary"></b-icon>
                                    History
                                </router-link>
                                <router-link :to="{ name: 'MenuItems',
                                                    params: { menu_id: menu_id }}"
                                    class="btn mx-md-1 btn-sm btn-outline-secondary">
                                    <b-icon icon="list-ul"
                                        variant="secondary"></b-icon>
                                    Items
                                </router-link>
                            </div>
                            <div class="pull-right">
                                <b-button
                                    class="text-white mx-md-1"
                                    size="sm"
                                    @click="cloneModal()"
                                    variant="warning">
                                    <b-icon icon="files"
                                        variant="white"></b-icon>
                                    Clone
                                </b-button>
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
                                :form="this.form"
                                :submit="onSubmit"
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
            menu_id: this.$route.params.menu_id,
            form: {},
            form_source: '/api/editorial-board/menus/form/',
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
            this.page_title = data.name;
        },
        getItem() {
            let source = '/api/editorial-board/menus/'+this.menu_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.setData(response.data)

                    // concurrency management
                    let obj_content_type = response.data.object_content_type;
                    let api_lock_src = '/api/editorial-board/redis-lock/set/';
                    let params = {'content_type_id': obj_content_type,
                                  'object_id': this.menu_id}
                    this.axios.post(api_lock_src, params,
                                     {headers: {"X-CSRFToken": this.$csrftoken }});
                    this.$user_is_active(api_lock_src, params);
                    this.interval = setInterval(() => {
                        this.$checkForRedisLocks(obj_content_type,
                                                 this.menu_id);
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
            let source = '/api/editorial-board/menus/'+this.menu_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.page_title = response.data.name
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu edited successfully',
                          dismissable: true }
                    );
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
        clone() {
            this.axios
                .get('/api/editorial-board/menus/'+this.menu_id+'/clone/')
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu cloned successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'MenuEdit',
                                       params: { menu_id: response.data.id,
                                                 alerts: this.alerts}})
                                .catch(() => {})
                    this.menu_id = response.data.id;
                    this.page_title = response.data.name;
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
        cloneModal() {
            this.$bvModal.msgBoxConfirm('Do you want really clone item?', {
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
                if (value) this.clone();
            })
        },
        remove() {
            this.axios
                .delete('/api/editorial-board/menus/'+this.menu_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'Menus',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete menu?', {
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
    },
    beforeDestroy() {
        clearInterval(this.interval)
    }
}
</script>
