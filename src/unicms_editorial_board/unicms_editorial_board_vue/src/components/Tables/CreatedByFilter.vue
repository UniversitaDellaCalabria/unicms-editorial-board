<template>
    <b-input-group>
        <b-form-select
            class="mb-3"
            id="created-by-select"
            v-model="created_by"
            v-on:change="updateCreatedBy()"
            :options="created_by_list"
            :aria-describedby="ariaDescribedby">
        </b-form-select>
    </b-input-group>
</template>
<script>
export default {
    name: 'CreatedByFilter',
    props: {
        created_by: { type: String },
        created_by_list: { type: Array },
    },
    methods: {
        updateCreatedBy() {
            this.$emit('updateCreatedBy', this.created_by);
            this.$emit('callApi');
        }
    }
}
</script>
