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
                                :form_source="form_source" />
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
            related_id: this.$route.params.related_id,
            form: {},
            form_source: '/api/editorial-board/sites/'+this.$route.params.site_id+'/webpaths/'+this.$route.params.webpath_id+'/pages/'+this.$route.params.page_id+'/related/form/',
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/related/'+this.related_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        if(key=='related_page')
                            this.$set(this.form, key, value.id)
                        else this.$set(this.form, key, value)
                    }
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/related/'+this.related_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page related edited successfully',
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
                .delete('/api/editorial-board/sites/'+this.site_id+'/webpaths/'+this.webpath_id+'/pages/'+this.page_id+'/related/'+this.related_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'page related removed successfully',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete page related?', {
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
