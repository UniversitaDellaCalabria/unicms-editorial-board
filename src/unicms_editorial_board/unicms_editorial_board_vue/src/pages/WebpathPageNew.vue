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
                                :files="files"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :tag_fields="tag_fields" />
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
            files: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/form/',
            tag_fields: ['tags'],
        }
    },
    methods: {
        onSubmit(event) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'WebpathPages',
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
                })
        },
        updateMedia(val) {
            let source = '/api/editorial-board/page-templates/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.$set(this.files, 'base_template', response.data.image);
                })
        },
    },
    watch: {
        'form.base_template': function(newVal, oldVal){
            this.updateMedia(newVal)
        }
    }
}
</script>
