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
            carousel_id: this.$route.params.carousel_id,
            carousel_item_id: this.$route.params.carousel_item_id,
            form: {},
            form_source: '/api/editorial-board/carousels/items/form/',
            files: {},
            page_title: ''
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/items/'+this.carousel_item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                    this.form.image = response.data.image.id;
                    this.$set(this.files, 'image', response.data.image.file);
                    this.page_title = response.data.image.title;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.carousel_item_id)
                    this.$refs.form.getOptionsFromParent('image',
                        [{"text": response.data.image.title,
                          "value": response.data.image.id}])
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
    watch: {
        'form.image': function(newVal, oldVal){
            if (newVal && newVal!=oldVal) this.updateMedia(newVal);
            if (!newVal) this.files.image = ''
        }
    }
}
</script>
