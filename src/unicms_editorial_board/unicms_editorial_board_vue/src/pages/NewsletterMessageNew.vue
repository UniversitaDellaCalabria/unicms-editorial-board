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
            form: {'newsletter': parseInt(this.$route.params.newsletter_id)},
            form_source: '/api/editorial-board/newsletters/'+this.$route.params.newsletter_id+'/messages/form/',
            rich_text_fields: ['content', 'intro_text', 'footer_text'],
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/newsletters/'+this.newsletter_id+'/messages/';
            event.preventDefault();
            const formData = new FormData();
            for ( var key in this.form ) {
                if(this.form[key] || this.form[key] == false){
                    formData.append(key, this.form[key]);
                }
                else formData.append(key, '');
            };
            this.axios
                .post(source, formData,
                      {headers: {'X-CSRFToken': this.$csrftoken}}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'message added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'NewsletterMessages',
                                       params: {newsletter_id: this.newsletter_id,
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
}
</script>
