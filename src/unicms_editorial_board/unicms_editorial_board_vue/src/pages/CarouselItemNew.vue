<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New">
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
            form: {'carousel': parseInt(this.$route.params.carousel_id)},
            form_source: '/api/editorial-board/carousels/'+this.$route.params.carousel_id+'/items/form/',
            add_modal_fields: {'image': this.$router.resolve({name: 'MediaNew'}).href,
                               'mobile_image': this.$router.resolve({name: 'MediaNew'}).href},
            files: {'image': '', 'mobile_image': ''}
        }
    },
    methods: {
        updateMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.$set(this.files, 'image', response.data.file);
                })
        },
        updateMobileMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.$set(this.files, 'mobile_image', response.data.file);
                })
        },
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/items/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'carousel item added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'CarouselItems',
                                       params: {carousel_id: this.carousel_id,
                                                alerts: this.alerts}})
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
    },
    watch: {
        'form.image': function(newVal, oldVal){
            this.updateMedia(newVal)
        },
        'form.mobile_image': function(newVal, oldVal){
            this.updateMobileMedia(newVal)
        }
    }
}
</script>
