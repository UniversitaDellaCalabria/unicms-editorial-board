<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New Media collection">
                        <b-card-text>
                            <django-form
                                :fields="fields"
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
            form: {},
            form_source: '/api/editorial-board/media-collections/form/'
        }
    },
    methods: {
        onSubmit(event) {
            let source = '/api/editorial-board/media-collections/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {'X-CSRFToken': this.$csrftoken}}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'item added successfully',
                          dismissable: true }
                    );
                    //this.$router.push({name: 'Webpaths'})
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
    },
}
</script>
