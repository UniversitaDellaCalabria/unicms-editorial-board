<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs v-if="$route.query.mode != 'raw'"/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New menu">
                        <b-card-text>
                            <django-form
                                ref="form"
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
            form_source: '/api/editorial-board/menus/form/'
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/menus/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {'X-CSRFToken': this.$csrftoken}}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu added successfully',
                          dismissable: true }
                    );
                    if(this.$route.query.mode != 'raw')
                        this.$router.push({name: 'Menus',
                                           params: {alerts: this.alerts}})
                    this.$refs.form.loading = false
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
