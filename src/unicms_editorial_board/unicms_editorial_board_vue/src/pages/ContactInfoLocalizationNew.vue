<template>
    <div class="content">
        <div class="container-fluid">
            <Breadcrumbs/>

            <stacked-alerts :alerts="alerts" />

            <div class="row">
                <div class="col-12">
                    <b-card title="Edit">
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
            contact_info_id: this.$route.params.contact_info_id,
            form: {'contact_info': parseInt(this.$route.params.contact_info_id)},
            form_source: '/api/editorial-board/contacts/'+this.$route.params.contact_id+'/infos/'+this.$route.params.contact_info_id+'/localizations/form/',
        }
    },
    methods: {
        onSubmit(event) {
            this.$refs.form.loading = true;
            let source = '/api/editorial-board/contacts/'+this.contact_id+'/infos/'+this.contact_info_id+'/localizations/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'contact information localization added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'ContactInfoLocalizations',
                                       params: {contact_id: this.contact_id,
                                                contact_info_id: this.contact_info_id,
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
