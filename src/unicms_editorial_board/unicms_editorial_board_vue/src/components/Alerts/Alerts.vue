<template>
    <div>
        <div>
            <b-alert
                v-for="alert in alerts" :key="alert.message"
                :dismissible="alert.dismissable ? true : false"
                :show="alert.ttl || 10"
                :variant="alert.variant">
                {{ alert.message }}
            </b-alert>
        </div>
    </div>
</template>
<script>
export default {
    name: "stacked-alerts",
    props: ['alerts'],
}
</script>
