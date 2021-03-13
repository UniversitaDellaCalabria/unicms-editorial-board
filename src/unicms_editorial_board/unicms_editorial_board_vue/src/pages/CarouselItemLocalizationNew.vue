<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Edit">
                        <b-card-text>
                            <django-form
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
            carousel_id: this.$route.params.carousel_id,
            carousel_item_id: this.$route.params.carousel_item_id,
            form: {'carousel_item': parseInt(this.$route.params.carousel_item_id)},
            form_source: '/api/editorial-board/carousels/'+this.$route.params.carousel_id+'/items/'+this.$route.params.carousel_item_id+'/localizations/form/',
        }
    },
    methods: {
        onSubmit(event) {
            let source = '/api/editorial-board/carousels/'+this.carousel_id+'/items/'+this.carousel_item_id+'/localizations/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'carousel item localization added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'CarouselItemLocalizations',
                                       params: {carousel_id: this.carousel_id,
                                                carousel_item_id: this.carousel_item_id,
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
                })
        },
    }
}
</script>
