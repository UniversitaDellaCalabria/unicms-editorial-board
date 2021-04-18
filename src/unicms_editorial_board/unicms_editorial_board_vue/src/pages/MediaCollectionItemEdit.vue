<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <div class="clearfix mb-5">
                            <div class="pull-right">
                                <b-button
                                    @click="deleteModal()"
                                    variant="danger"
                                    class="mx-md-1 btn-sm">
                                    <b-icon icon="trash"
                                        variant="white"></b-icon>
                                    Delete
                                </b-button>
                            </div>
                        </div>
                        <b-card-title>{{ page_title }}</b-card-title>
                        <b-card-text>
                            <django-form
                                ref="form"
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
            collection_id: this.$route.params.collection_id,
            collection_item_id: this.$route.params.collection_item_id,
            form: {},
            form_source: '/api/editorial-board/media-collections/'+this.$route.params.collection_id+'/items/form/',
            files: {},
            page_title: ''
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/media-collections/'+this.collection_id+'/items/'+this.collection_item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                    this.form.media = response.data.media.id;
                    this.$set(this.files, 'media', response.data.media.file);
                    this.page_title = response.data.media.title;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.collection_item_id)
                    this.$refs.form.getOptionsFromParent('media',
                        [{"text": response.data.media.title,
                          "value": response.data.media.id}])
                })
        },
        updateMedia(val) {
            let source = '/api/editorial-board/medias/'+val+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.files.media = response.data.file
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/media-collections/'+this.collection_id+'/items/'+this.collection_item_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media collection item edited successfully',
                          dismissable: true }
                    )
                    this.page_title = response.data.media.title;
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
                .delete('/api/editorial-board/media-collections/'+this.collection_id+'/items/'+this.collection_item_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media collection item removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'MediaCollectionItems',
                                       params: {collection_id: this.collection_id,
                                                alerts: this.alerts}})
                    }
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
            this.$bvModal.msgBoxConfirm('Do you want really delete media collection item?', {
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
        'form.media': function(newVal, oldVal){
            if (newVal && newVal!=oldVal) this.updateMedia(newVal);
            if (!newVal) this.files.media = ''
        }
    }
}
</script>
