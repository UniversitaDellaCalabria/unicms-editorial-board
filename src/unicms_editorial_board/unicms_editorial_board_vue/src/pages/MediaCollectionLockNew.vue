<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="New">
                        <b-card-text>
                            <django-form
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
            collection_id: this.$route.params.collection_id,
            form: {},
            form_source: '/api/editorial-board/users/form/',
        }
    },
    methods: {
        retrieveObject() {
            let source = '/api/editorial-board/media-collections/'+this.collection_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    this.content_type = response.data.object_content_type;
                })
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
        onSubmit(event) {
            let source = '/api/editorial-board/locks/'+this.content_type+'/'+this.collection_id+'/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'lock added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'MediaCollectionLocks',
                                       params: {media_id: this.collection_id,
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
                })
        },
    },
    mounted() {
        this.retrieveObject()
    }
}
</script>
