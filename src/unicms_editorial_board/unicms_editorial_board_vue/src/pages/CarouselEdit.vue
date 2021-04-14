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
                                <router-link :to="{ name: 'CarouselItems',
                                            params: { carousel_id: carousel_id }}"
                                    class="btn btn-sm btn-outline-secondary">
                                    <b-icon icon="list-ul"
                                        variant="secondary"></b-icon>
                                    Items
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
            carousel_id: this.$route.params.carousel_id,
            form: {},
            form_source: '/api/editorial-board/carousels/form/',
            page_title: '',
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                    this.page_title = response.data.name;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.carousel_id)
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'carousel edited successfully',
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
                .delete('/api/editorial-board/carousels/'+this.carousel_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'carousel removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'Carousels',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete carousel?', {
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
        this.getItem()
    }
}
</script>
