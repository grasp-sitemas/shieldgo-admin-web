<template>
    <div id="gritter-notice-wrapper" :style="{ opacity: gritterOpened ? 1 : 0 }">
        <div class="gritter-item-wrapper" role="alert">
            <div class="gritter-item">
                <a class="gritter-close" @click="removeGritter">Close Notification</a>
                <div class="gritter-without-image">
                    <span class="gritter-title">{{ title }}</span>
                    <p>{{ text }}</p>
                    <p>{{ subText }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GritterNotification',
    props: ['title', 'text', 'subText', 'time'],
    data() {
        return {
            gritterOpened: false,
        }
    },
    methods: {
        addGritter() {
            this.gritterOpened = true
            this.$emit('after-open')

            if (this.time) {
                setTimeout(() => {
                    this.removeGritter()
                }, this.time)
            }
        },
        removeGritter() {
            this.$emit('before-close')
            this.gritterOpened = false
            this.$emit('after-close')
        },
    },
    mounted() {
        this.addGritter()
    },
}
</script>

<style scoped>
#gritter-notice-wrapper {
    position: fixed;
    top: 30;
    right: 30;
    z-index: 9999;
}

p {
    margin: 0.2em 0 0 0;
}
.gritter-close {
    display: none;
    position: absolute;
    top: 5px;
    left: 3px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    text-indent: -9999em;
}
</style>
