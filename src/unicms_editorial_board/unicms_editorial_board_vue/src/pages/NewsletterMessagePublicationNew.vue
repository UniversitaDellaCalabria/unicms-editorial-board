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
            newsletter_id: this.$route.params.newsletter_id,
            message_id: this.$route.params.message_id,
            form: {},
            form_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/'+this.$route.params.message_id+'/publications/form/',
            files: {},
            add_modal_fields: {'publication': this.$router.resolve({name: 'PublicationNew'}).href},
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/'+this.message_id+'/publications/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'NewsletterMessagePublications',
                                       params: {newsletter_id: this.newsletter_id,
                                                message_id: this.message_id,
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
    }
}
</script>
