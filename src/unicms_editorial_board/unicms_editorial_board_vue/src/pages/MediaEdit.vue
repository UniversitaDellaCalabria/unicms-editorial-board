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
                            variant="danger"
                            class="mx-1">
                            <b-icon icon="trash"
                                variant="white"></b-icon>
                            Delete
                        </b-button>

                        <b-card-title>Edit</b-card-title>

                        <b-card-text>
                            <django-form
                                :fields="fields"
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
            item_id: this.$route.params.media_id,
            form: {},
            form_source: '/api/editorial-board/medias/form/',
            files: {}
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/medias/'+this.item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                    this.$set(this.files, 'file', this.form.file);
                    this.$delete(this.form, 'file');
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/medias/'+this.item_id+'/';
            event.preventDefault();
            const formData = new FormData();
            for ( var key in this.form ) {
                formData.append(key, this.form[key]);
            };
            this.axios
                .patch(source, formData,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media edited successfully',
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
                .delete('/api/editorial-board/medias/'+this.item_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'media removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'Medias',
                                       params: {alerts: this.alerts}})
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
            this.$bvModal.msgBoxConfirm('Do you want really delete this media?', {
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
