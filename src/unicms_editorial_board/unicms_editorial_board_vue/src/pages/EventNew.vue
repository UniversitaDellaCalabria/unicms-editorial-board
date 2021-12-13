<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs v-if="$route.query.mode != 'raw'"/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New event">
                        <b-card-text>
                            <django-form
                                ref="form"
                                :form="form"
                                :submit="onSubmit"
                                :add_modal_fields="add_modal_fields"
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
            form_source: '/api/editorial-board/events/form/',
            add_modal_fields: {'publication':  this.$router.resolve({name: 'PublicationNew'}).href},
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/events/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {'X-CSRFToken': this.$csrftoken}}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'event added successfully',
                          dismissable: true }
                    );
                    if(this.$route.query.mode != 'raw')
                        this.$router.push({name: 'Events',
                                           params: {alerts: this.alerts}})
                    this.$refs.form.loading = false;
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
