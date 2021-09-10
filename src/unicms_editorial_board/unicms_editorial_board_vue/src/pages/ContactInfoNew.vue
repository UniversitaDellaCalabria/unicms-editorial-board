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
            contact_id: this.$route.params.contact_id,
            form: {'contact': parseInt(this.$route.params.contact_id)},
            form_source: '/api/editorial-board/contacts/'+this.$route.params.contact_id+'/infos/form/',
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/contacts/'+this.contact_id+'/infos/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'contact information added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'ContactInfos',
                                       params: {contact_id: this.contact_id,
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
                    this.$refs.form.loading = false;
                })
        },
    }
}
</script>
