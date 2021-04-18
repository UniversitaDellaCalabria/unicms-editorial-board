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
                                <router-link :to="{ name: 'PublicationAttachments',
                                                    params: { publication_id: publication_id }}"
                                    class="btn mx-md-1 btn-outline-secondary btn-sm">
                                    <b-icon icon="file-text"
                                        variant="secondary"></b-icon>
                                    Attachments
                                </router-link>
                                <router-link :to="{ name: 'PublicationGalleries',
                                                    params: { publication_id: publication_id }}"
                                    class="btn mx-md-1 btn-outline-secondary btn-sm">
                                    <b-icon icon="card-image"
                                        variant="secondary"></b-icon>
                                    Galleries
                                </router-link>
                                <router-link :to="{ name: 'PublicationLinks',
                                                    params: { publication_id: publication_id }}"
                                    class="btn mx-md-1 btn-outline-secondary btn-sm">
                                    <b-icon icon="link45deg"
                                        variant="secondary"></b-icon>
                                    Links
                                </router-link>
                                <router-link :to="{ name: 'PublicationLocalizations',
                                                    params: { publication_id: publication_id }}"
                                    class="btn mx-md-1 btn-outline-secondary btn-sm">
                                    <b-icon icon="flag"
                                        variant="secondary"></b-icon>
                                    Localizations
                                </router-link>
                                <router-link :to="{ name: 'PublicationRelated',
                                                    params: { publication_id: publication_id }}"
                                    class="btn mx-md-1 btn-outline-secondary btn-sm">
                                    <b-icon icon="share"
                                        variant="secondary"></b-icon>
                                    Related publications
                                </router-link>
                            </div>

                            <div class="pull-right">
                                <b-button
                                    v-if="is_active"
                                    @click="toggleIsActiveModal()"
                                    variant="danger"
                                    size="sm"
                                    class="mx-md-1 btn-sm">
                                    <b-icon icon="x-circle"></b-icon>
                                    Deactivate
                                </b-button>
                                <b-button
                                    v-else
                                    @click="toggleIsActiveModal()"
                                    variant="success"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="check-circle"></b-icon>
                                    Activate
                                </b-button>
                                <b-button
                                    @click="deleteModal()"
                                    variant="danger"
                                    size="sm"
                                    class="mx-md-1">
                                    <b-icon icon="trash"
                                        variant="white"></b-icon>
                                    Delete
                                </b-button>
                            </div>
                        </div>
                        <b-card-title>{{ page_title }}</b-card-title>
                        <b-card-text>
                            <p>
                                <b>Activation status: </b>
                                <b-icon
                                    icon="circle-fill"
                                    font-scale="0.8"
                                    variant="success"
                                    v-if="is_active">
                                </b-icon>
                                <b-icon
                                    icon="circle-fill"
                                    font-scale="0.8"
                                    variant="danger"
                                    v-else>
                                </b-icon>
                            </p>
                            <hr />
                            <django-form
                                ref="form"
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
            publication_id: this.$route.params.publication_id,
            form: {},
            form_source: '/api/editorial-board/publications/form/',
            files: {},
            rich_text_fields: ['content'],
            tag_fields: ['tags'],
            page_title: '',
            is_active: false,
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/publications/'+this.publication_id+'/';
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
                            this.$set(this.form, key, value.id)
                        else this.$set(this.form, key, value)
                    }
                    this.$set(this.files, 'presentation_image', response.data.presentation_image.file);
                    this.page_title = response.data.title;
                    this.is_active = response.data.is_active;
                    this.$checkForRedisLocks(response.data.object_content_type,
                                             this.publication_id)
                    if(response.data.presentation_image)
                        this.$refs.form.getOptionsFromParent('presentation_image',
                            [{"text": response.data.presentation_image.title,
                              "value": response.data.presentation_image.id}])
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
            let source = '/api/editorial-board/publications/'+this.publication_id+'/';
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
                    )}
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
                    );
                    this.$router.push({name: 'Publications',
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
        toggleIsActive() {
            this.axios
                .get('/api/editorial-board/publications/'+this.publication_id+'/change-status/')
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'status updated successfully',
                          dismissable: true }
                    );
                    this.is_active = response.data.is_active;
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
        toggleIsActiveModal() {
            this.$bvModal.msgBoxConfirm('Do you want really change activation status?', {
            title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'success',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                }
            ).then(value => {
                if (value) this.toggleIsActive();
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
