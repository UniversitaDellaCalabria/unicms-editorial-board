<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs v-if="$route.query.mode != 'raw'"/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <b-card-title>New publication</b-card-title>
                        <b-card-text>
                            <django-form
                                ref="form"
                                :form="form"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :files="files"
                                :add_modal_fields="add_modal_fields"
                                :rich_text_fields="rich_text_fields"
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
            form: {},
            form_source: '/api/editorial-board/publications/form/',
            files: {'presentation_image': '', 'preview_image': ''},
            add_modal_fields: {'presentation_image': this.$router.resolve({name: 'MediaNew'}).href,
                               'preview_image': this.$router.resolve({name: 'MediaNew'}).href},
            rich_text_fields: ['content'],
            tag_fields: ['tags'],
        }
    },
    methods: {
        updateMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.$set(this.files, 'presentation_image', response.data.file)
                })
        },
        updateMediaPreview(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.$set(this.files, 'preview_image', response.data.file)
                })
        },
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/publications/';
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
                    if(this.$route.query.mode != 'raw')
                        this.$router.push({name: 'Publications',
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
        }
    },
    watch: {
        'form.preview_image': function(newVal, oldVal){
            this.updateMediaPreview(newVal)
        },
        'form.presentation_image': function(newVal, oldVal){
            this.updateMedia(newVal)
        }
    }
}
</script>
