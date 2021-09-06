<template>
    <b-input-group>
        <b-form-select
            class="mb-3"
            id="media-filetype-select"
            v-model="media_type"
            v-on:change="updateMediaType()"
            :options="type_list"
            :aria-describedby="ariaDescribedby">
        </b-form-select>
    </b-input-group>
</template>
<script>
export default {
    name: 'MediaTypeFilter',
    props: {
        media_type: { type: String },
    },
    data () {
        return {
            types_list: []
        }
    },
    methods: {
        callMediaFiltersApi() {
            let source = '/api/editorial-board/medias/allowed-filetypes/';
            this.axios
                .get(source)
                .then(response => {
                    this.types_list = response
                    console.log(this.types_list)
                })
        },
        updateMediaTypeFilter() {
            this.$emit('updateMediaTypeFilter', this.media_type);
            this.$emit('callApi');
        }
    },
    mounted() {
        this.callMediaFiltersApi()
    }
}
</script>
