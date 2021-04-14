<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New Media">
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
            form: {},
            form_source: '/api/editorial-board/medias/form/'
        }
    },
    methods: {
        onSubmit(event) {
            let source = '/api/editorial-board/medias/';
            event.preventDefault();
            const formData = new FormData();
            for ( var key in this.form ) {
                formData.append(key, this.form[key]);
            };
            this.axios
                .post(source, formData,
                      {headers: {'X-CSRFToken': this.$csrftoken}}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'item added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'Media',
                                       params: {alerts: this.alerts}})
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
