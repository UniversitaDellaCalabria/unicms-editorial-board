<template>
    <CompleteTable
        :api_source="api_source"
        :fields="fields"
        :files="files"
        :ordering="ordering"
        :ordering_list="ordering_list"
        :page_title="page_title"
        :showIsActive="false"
        ref="completeTable">

        <template #add_new>
            <router-link :to="{ name: 'MediaNew'}"
                class="btn btn-success">
                <b-icon icon="plus-circle"
                        variant="white"></b-icon>
                Add new
            </router-link>
        </template>

         <template #custom_filter>
            <div class="col col-12 col-sm">
                <b-input-group>
                    <b-form-select
                        class="mb-3"
                        id="media-filetype-select"
                        v-on:change="updateMediaType($event)"
                        v-model="file_type"
                        :aria-describedby="ariaDescribedby">
                        <b-form-select-option selected>
                            - All file types -
                        </b-form-select-option>
                        <b-form-select-option
                            v-for="filetype in types_list"
                            :value="filetype">
                            {{ filetype }}
                        </b-form-select-option>
                    </b-form-select>
                </b-input-group>
            </div>
        </template>

        <template #actions="item">
            <router-link :to="{ name: 'MediaEdit',
                            params: { media_id: item.item.id }}"
                class="btn-block btn btn-sm btn-info">
                <b-icon icon="pencil-square"
                    variant="white"></b-icon>
                Edit
            </router-link>
            <router-link :to="{ name: 'MediaLocks',
                                params: { media_id: item.item.id }}"
                class="btn btn-block btn-sm btn-secondary">
                <b-icon icon="lock"
                    variant="white"></b-icon>
                Allowed users
            </router-link>
        </template>

    </CompleteTable>
</template>
<script>
import CompleteTable from '../layout/CompleteTable.vue'
import MediaTypeFilter from '../components/Tables/MediaTypeFilter.vue'

export default {
    components: {
        CompleteTable
    },
    data () {
        return {
            api_source: '/api/editorial-board/medias/',
            collection_id: this.$route.params.collection_id,
            fields: [
                'id',
                'title',
                {key: 'file', thClass: 'w-25'},
                'description',
                {key: 'file_type', label: 'Type'},
                {key: 'file_size', label: 'Size (kb)'},
                {key: 'file_dimensions', label: 'Dimensions'},
                'actions'
            ],
            files: ['file'],
            ordering: 'title',
            ordering_list: [
                { text: 'Id', value: 'id' },
                { text: 'Title', value: 'title' },
                { text: 'Description', value: 'description' },
                { text: 'File type', value: 'file_type' },
            ],
            file_type: '',
            types_list: [],
            page_title: 'Media'
        }
    },
    methods: {
        callMediaFiltersApi() {
            let source = '/api/editorial-board/medias/allowed-filetypes/';
            this.axios
                .get(source)
                .then(response => {
                    this.types_list = response.data
                })
        },
        updateMediaType(value='') {
            this.$refs.completeTable.custom_filters.file_type = value
            this.$refs.completeTable.callApi(null, 1)
        }
    },
    mounted() {
        this.file_type = this.$refs.completeTable.custom_filters.file_type
        this.callMediaFiltersApi()
    }
}
</script>
