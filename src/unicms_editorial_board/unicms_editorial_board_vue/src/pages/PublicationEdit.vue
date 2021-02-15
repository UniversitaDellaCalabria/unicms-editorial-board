<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>

                        <b-button
                            @click="deleteModal()"
                            variant="outline-danger"
                            class="mx-1">
                            <b-icon icon="trash"
                                variant="danger"></b-icon>
                            Delete
                        </b-button>
                        <b-card-title>Edit</b-card-title>
                        <b-card-text>
                            <django-form
                                :fields="fields"
                                :form="form"
                                :submit="onSubmit"
                                :form_source="form_source"
                                :files="files"
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
            item_id: this.$route.params.publication_id,
            form: {},
            form_source: '/api/editorial-board/publications/form/',
            files: {},
            rich_text_fields: ['content'],
            tag_fields: ['tags']
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/publications/'+this.item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        if(key=='category') {
                            let categories = [];
                            value.forEach(v => {categories.push(v.id)});
                            this.$set(this.form, key, categories)
                        }
                        else if(key=='presentation_image')
                            this.$set(this.form, 'presentation_image', response.data.presentation_image.id)
                        else this.$set(this.form, key, value)
                    }
                    this.$set(this.files, 'presentation_image', response.data.presentation_image.file);
                })
        },
        updateMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.files.presentation_image = response.data.file
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/publications/'+this.item_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication edited successfully',
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
        remove() {
            this.axios
                .delete('/api/editorial-board/publications/'+this.item+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication removed successfully',
                          dismissable: true }
                    )}
                )
                .catch(error => {
                    this.alerts.push(
                        { variant: 'danger',
                          message: error.response.data.detail,
                          dismissable: true }
                    )
                })
        },
        deleteModal() {
            this.$bvModal.msgBoxConfirm('Do you want really delete publication?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.remove();
            })
        }
    },
    mounted() {
        this.getItem()
    },
    watch: {
        'form.presentation_image': function(newVal, oldVal){
            if (newVal && newVal!=oldVal) this.updateMedia(newVal);
            if (!newVal) this.files.presentation_image = ''
        }
    }
}
</script>
