<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false">

        <template #add_new>
            <router-link :to="{ name: 'ContactInfoNew',
                                params: { contact_id: contact_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #childs="item">
            <router-link :to="{ name: 'ContactInfoLocalizations',
                                params: { contact_id: contact_id,
                                          contact_info_id: item.item.id}}"
                class="btn btn-block btn-sm btn-outline-secondary">
                <b-icon icon="flag"
                    variant="secondary"></b-icon>
                Localizations
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'ContactInfoEdit',
                            params: { contact_id: contact_id,
                                      contact_info_id: item.item.id}}"
                class="btn btn-block btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
        </template>

    </CompleteTable>
</template>
<script>
import CompleteTable from '../layout/CompleteTable.vue'

export default {
    components: {
        CompleteTable
    },
    data () {
        return {
            api_source: '/api/editorial-board/contacts/'+this.$route.params.contact_id+'/infos/',
            contact_id: this.$route.params.contact_id,
            fields: [
                'id',
                'label',
                'value',
                {key: 'info_type', label: 'Type'},
                'order',
                {key: 'is_active', label: 'Active'},
                'actions'
            ],
            ordering: 'order',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Label', value: 'label' },
                            { text: 'Type', value: 'info_type' },
                            { text: 'Order', value: 'order' },
                            { text: 'State', value: 'is_active'}],
            page_title: 'Contact informations'
        }
    }
}
</script>
