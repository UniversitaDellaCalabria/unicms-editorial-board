<template>
    <div>
        <div>
            <b-alert
                v-if="redis_alert"
                :dismissible="redis_alert.dismissable ? true : false"
                show
                :variant="redis_alert.variant">
                {{ redis_alert.message }}
                <b-icon
                    icon="pencil-fill"
                    animation="cylon"
                    font-scale="1"
                    class="ml-2">
                </b-icon>
            </b-alert>

            <b-alert
                v-for="alert in alerts"
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
    props: [
        'alerts',
        'redis_alert'
    ]
}
</script>
