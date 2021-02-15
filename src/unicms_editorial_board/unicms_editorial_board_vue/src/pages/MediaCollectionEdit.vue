<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card>
                        <router-link :to="{ name: 'MediaCollectionItems',
                                            params: { collection_id: item_id }}"
                            class="btn btn-outline-secondary">
                            <b-icon icon="list-ul"
                                variant="secondary"></b-icon>
                            Items
                        </router-link>
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
                                :tag_fields="tag_fields"/>
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
            item_id: this.$route.params.collection_id,
            form: {},
            form_source: '/api/editorial-board/media-collections/form/',
            tag_fields: ['tags']
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/media-collections/'+this.item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/media-collections/'+this.item_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media collection edited successfully',
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
                .delete('/api/editorial-board/media-collections/'+this.item_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media collection removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete media collection?', {
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
        this.getItem();
    }
}
</script>
