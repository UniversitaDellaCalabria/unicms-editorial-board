<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <b-card-title>New</b-card-title>
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
            form: {'publication': parseInt(this.$route.params.publication_id)},
            publication_id: this.$route.params.publication_id,
            form_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/links/form/',
        }
    },
    methods: {
        onSubmit(event) {
            let source = '/api/editorial-board/publications/'+this.publication_id+'/links/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication addedd successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'PublicationLinks',
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
                })
        }
    }
}
</script>
