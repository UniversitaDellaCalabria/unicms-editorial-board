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
            site_id: this.$route.params.site_id,
            webpath_id: this.$route.params.webpath_id,
            form: {'webpath': parseInt(this.$route.params.webpath_id)},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/calendar-contexts/form/',
            add_modal_fields: {'calendar':  this.$router.resolve({name: 'CalendarNew'}).href},
        }
    },
    methods: {
        getWebpath(){
            let api_source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/options/'+this.webpath_id+'/';
            this.axios
                .get(api_source)
                .then(response => {
                    this.$refs.form.getOptionsFromParent('webpath',
                        [{"text": response.data.text,
                          "value": response.data.value}])
                    }
                )
        },
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/calendar-contexts/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'webpath calendar added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'WebpathCalendars',
                                       params: {site_id: this.site_id,
                                                webpath_id: this.webpath_id,
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
    mounted() {
        this.getWebpath()
    }
}
</script>
