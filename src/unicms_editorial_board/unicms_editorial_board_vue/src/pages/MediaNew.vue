<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs v-if="$route.query.mode != 'raw'"/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New Media">
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
            form_source: '/api/editorial-board/medias/form/',
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/medias/';
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
                          message: 'item added successfully',
                          dismissable: true }
                    );
                    if(this.$route.query.mode != 'raw')
                        this.$router.push({name: 'Media',
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
    }
}
</script>
