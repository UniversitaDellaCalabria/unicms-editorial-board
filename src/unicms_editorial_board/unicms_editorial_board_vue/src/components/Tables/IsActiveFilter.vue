<template>
    <b-input-group>
        <b-form-select
            class="mb-3"
            id="created-by-select"
            v-model="is_active"
            v-on:change="updateIsActive()"
            :options="state_list"
            :aria-describedby="ariaDescribedby">
        </b-form-select>
    </b-input-group>
</template>
<script>
export default {
    name: 'CreatedByFilter',
    props: {
        is_active: { type: String },
    },
    data () {
        return {
            state_list: [
                { text: 'Show all items', value: ''},
                { text: 'Only active', value: 1},
                { text: 'Only inactive', value: 0},
            ],
        }
    },
    methods: {
        updateIsActive() {
            this.$emit('updateIsActive', this.is_active);
            this.$emit('callApi');
        }
    }
}
</script>
