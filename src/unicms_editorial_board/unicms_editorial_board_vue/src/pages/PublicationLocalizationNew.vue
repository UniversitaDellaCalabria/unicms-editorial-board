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
            publication_id: this.$route.params.publication_id,
            form: {'publication': parseInt(this.$route.params.publication_id)},
            form_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/localizations/form/',
            rich_text_fields: ['content']
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/publications/'+this.publication_id+'/localizations/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication localization added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'PublicationLocalizations',
                                       params: {publication_id: this.publication_id,
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
                    this.$refs.form.loading = false
                })
        },
    },
}
</script>
