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
                                :form="form"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :files="files" />
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
            page_id: this.$route.params.page_id,
            form: {'page': parseInt(this.$route.params.page_id)},
            files: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/'+this.$route.params.page_id+'/medias/form/',
        }
    },
    methods: {
        updateMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.$set(this.files, 'media', response.data.file);
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/medias/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page media added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'WebpathPageMedia',
                                       params: {site_id: this.site_id,
                                                webpath_id: this.webpath_id,
                                                page_id: this.page_id,
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
        },
    },
    watch: {
        'form.media': function(newVal, oldVal){
            this.updateMedia(newVal)
        }
    }
}
</script>
