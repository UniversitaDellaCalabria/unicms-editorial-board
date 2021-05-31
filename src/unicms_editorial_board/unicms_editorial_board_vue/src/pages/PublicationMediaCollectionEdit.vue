<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <div class="clearfix mb-5">
                            <div class="pull-left">
                                <router-link :to="{ name: 'PublicationMediaCollectionLogs',
                                                    params: { publication_id: publication_id,
                                                              collection_id: collection_id}}"
                                    class="btn btn-sm btn-outline-secondary mx-md-1">
                                    <b-icon icon="clock-history"
                                        variant="secondary"></b-icon>
                                    History
                                </router-link>
                            </div>
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
            publication_id: this.$route.params.publication_id,
            collection_id: this.$route.params.collection_id,
            form: {},
            form_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/media-collections/form/',
            add_modal_fields: {'collection':  this.$router.resolve({name: 'MediaCollectionNew'}).href},
            page_title: ''
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/publications/'+this.publication_id+'/media-collections/'+this.collection_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        if(key=='collection') {
                            this.$set(this.form, key, value.id)
                        }
                        else this.$set(this.form, key, value)
                    }
                    this.page_title = response.data.collection.name;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.publication_id)
                    this.$refs.form.getOptionsFromParent('collection',
                        [{"text": response.data.collection.name,
                          "value": response.data.collection.id}])
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/publications/'+this.publication_id+'/media-collections/'+this.collection_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication media-collection edited successfully',
                          dismissable: true }
                    );
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
                .delete('/api/editorial-board/publications/'+this.publication_id+'/media-collections/'+this.collection_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'publication media-collection removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'PublicationMediaCollections',
                                       params: {publication_id: this.publication_id,
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
            this.$bvModal.msgBoxConfirm('Do you want really delete publication media-collection?', {
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
}
</script>
