<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Edit">
                        <b-card-text>
                            <django-form
                                ref="form"
                                :form="form"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :add_modal_fields="add_modal_fields"
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
            collection_id: this.$route.params.collection_id,
            form: {'collection': parseInt(this.$route.params.collection_id)},
            form_source: '/api/editorial-board/media-collections/'+this.$route.params.collection_id+'/items/form/',
            add_modal_fields: {'media':  this.$router.resolve({name: 'MediaNew'}).href},
            files: {'media': ''}
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
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/media-collections/'+this.collection_id+'/items/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media collection item added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'MediaCollectionItems',
                                       params: {collection_id: this.collection_id,
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
                    this.$refs.form.loading = false;
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
