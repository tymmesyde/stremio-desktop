<template >
    <div class="toggle" @click="$emit('update:modelValue', !modelValue)">
        <ion-icon name="toggle" v-if="modelValue"></ion-icon>
        <ion-icon name="toggle-outline" class="off" v-else></ion-icon>
        <p>{{ text }}</p>
    </div>
</template>

<script>
export default {
    name: 'Toggle',
    emits: ['update:modelValue'],
    props: {
        modelValue: Boolean,
        text: String
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    ion-icon {
        font-size: 30px;
        color: $button-color;

        &.off {
            color: $text-color;
            transform: rotate(180deg);
        }
    }

    &:disabled {
        opacity: 0.3;
    }
}
</style>