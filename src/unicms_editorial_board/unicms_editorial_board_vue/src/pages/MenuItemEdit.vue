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

                        <b-card-title>{{ page_title }}</b-card-title>

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
            menu_id: this.$route.params.menu_id,
            menu_item_id: this.$route.params.menu_item_id,
            form: {},
            form_source: '/api/editorial-board/menus/'+this.$route.params.menu_id+'/items/form/',
            files: {},
            page_title: ''
        }
    },
    methods: {
        getItem() {
            let source = '/api/editorial-board/menus/'+this.menu_id+'/items/'+this.menu_item_id+'/';
            this.axios
                .get(source)
                .then(response => {
                    for (const [key, value] of Object.entries(response.data)) {
                        this.$set(this.form, key, value)
                    }
                    this.page_title = response.data.name
                })
        },
        onSubmit(event) {
            let source = '/api/editorial-board/menus/'+this.menu_id+'/items/'+this.menu_item_id+'/';
            event.preventDefault();
            this.axios
                .patch(source, this.form,
                      {headers: {"X-CSRFToken": this.$csrftoken }}
                )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu item edited successfully',
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
                .delete('/api/editorial-board/menus/'+this.menu_id+'/items/'+this.menu_item_id+'/',
                        {headers: {"X-CSRFToken": this.$csrftoken }}
                       )
                .then(response => {
                    this.alerts.push(
                        { variant: 'success',
                          message: 'menu item removed successfully',
                          dismissable: true }
                    );
                    this.$router.push({name: 'MenuItems',
                                       params: {menu_id: this.menu_id,
                                       alerts: this.alerts}})}
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
            this.$bvModal.msgBoxConfirm('Do you want really delete menu item?', {
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
    }
}
</script>