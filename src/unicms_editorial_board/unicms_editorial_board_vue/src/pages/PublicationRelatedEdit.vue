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
            publication_id: this.$route.params.publication_id,
            related_id: this.$route.params.related_id,
            form: {},
            form_source: '/api/editorial-board/publications/'+this.$route.params.publication_id+'/related/form/',
            page_title: ''
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/publications/'+this.publication_id+'/related/'+this.related_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        if(key=='related') {
                            this.$set(this.form, key, value.id)
                        }
                        else this.$set(this.form, key, value)
                    }
                    this.page_title = response.data.related.title;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.related_id)
                    this.$refs.form.getOptionsFromParent('related',
                        [{"text": response.data.related.title,
                          "value": response.data.related.id}])
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/publications/'+this.publication_id+'/related/'+this.related_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'related publication edited successfully',
                          dismissable: true }
                    )
                    this.page_title = response.data.related.title
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
                .delete('/api/editorial-board/publications/'+this.publication_id+'/related/'+this.localization_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'related publication removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'PublicationRelated',
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
            this.$bvModal.msgBoxConfirm('Do you want really delete related publication?', {
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
