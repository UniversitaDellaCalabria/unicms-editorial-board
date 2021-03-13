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
            menu_id: this.$route.params.menu_id,
            form: {'menu': parseInt(this.$route.params.menu_id)},
            form_source: '/api/editorial-board/menus/'+this.$route.params.menu_id+'/items/form/'
        }
    },
    methods: {
        onSubmit(event) {
            let source = '/api/editorial-board/menus/'+this.menu_id+'/items/';
            event.preventDefault();
            this.axios
                .post(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu item added successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'MenuItems',
                                       params: {menu_id: this.menu_id,
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
    }
}
</script>
