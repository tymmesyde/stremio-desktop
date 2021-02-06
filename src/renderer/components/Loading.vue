<template>
    <ion-icon name="sync-outline"></ion-icon>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

ion-icon {
    font-size: 50px;
    color: $text-color;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>