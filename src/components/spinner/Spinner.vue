<template>
    <div class="loading">
        <i class="fas fa-spinner fa-spin spinner-style" />
    </div>
</template>

<style lang="css" scoped>
.loading {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.35);
}
.spinner-style {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    color: var(--app-theme-color);
}
</style>
