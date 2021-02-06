<template>
    <button>
        <ion-icon :name="icon"></ion-icon>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        icon: String
    }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 45px;
    border: 0;
    padding: 0 20px;
    background-color: $button-color;
    font-family: 'Roboto-Bold';
    font-size: 16px;
    color: $text-color;
    outline: none;
    

    &:disabled {
        opacity: 0.3;
    }

    &:not(:disabled):hover {
        background-color: $button-color-hover;
        cursor: pointer;
    }

    &:not(:disabled):active {
        background-color: $button-color-active;
    }

    ion-icon {
        font-size: 15px;
    }
}
</style>