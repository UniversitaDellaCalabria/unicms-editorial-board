<template>
    <b-input-group>
        <b-form-select
            class="w-75 mb-3"
            id="sort-by-select"
            v-model="ordering"
            v-on:change="updateData()"
            :options="ordering_list"
            :aria-describedby="ariaDescribedby">
        </b-form-select>
        <b-form-select
            v-model="sortDesc"
            v-on:change="updateData()"
            :aria-describedby="ariaDescribedby"
            class="w-25">
            <option value="+">Asc</option>
            <option value="-">Desc</option>
        </b-form-select>
    </b-input-group>
</template>
<script>
export default {
    name: 'OrderingFilter',
    props: {
        ordering_list: { type: Array },
        sortDesc: { type: String },
        ordering: { type: String },
    },
    methods: {
        updateData() {
            this.$emit('updateOrdering', this.ordering);
            this.$emit('updateSortDesc', this.sortDesc);
            this.$emit('callApi');
        }
    }
}
</script>
