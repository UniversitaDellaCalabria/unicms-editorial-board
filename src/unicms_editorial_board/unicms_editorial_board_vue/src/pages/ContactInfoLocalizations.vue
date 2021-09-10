<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showCreatedBy="false">

        <template #add_new>
            <router-link :to="{ name: 'ContactInfoLocalizationNew',
                                params: { contact_id: contact_id,
                                          contact_info_id: contact_info_id }}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'ContactInfoLocalizationEdit',
                            params: { contact_id: contact_id,
                                      contact_info_id: contact_info_id,
                                      localization_id: item.item.id}}"
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
            api_source: '/api/editorial-board/contacts/'+this.$route.params.contact_id+'/infos/'+this.$route.params.contact_info_id+'/localizations/',
            contact_id: this.$route.params.contact_id,
            contact_info_id: this.$route.params.contact_info_id,
            fields: [
                'id',
                'language',
                'label',
                'value',,
                'order',
                { key: 'is_active', label: 'Active'},
                'actions'
            ],
            ordering: 'order',
            ordering_list: [{ text: 'Id', value: 'id' },
                            { text: 'Language', value: 'language' },
                            { text: 'Label', value: 'label' },
                            { text: 'Value', value: 'value' },
                            { text: 'Order', value: 'order'},
                            { text: 'State', value: 'is_active'}],
            page_title: 'Contact information localizations'
        }
    }
}
</script>
