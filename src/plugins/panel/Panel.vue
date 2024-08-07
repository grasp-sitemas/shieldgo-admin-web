<template>
    <div class="panel" v-bind:class="[{ 'panel-expand': expand, 'panel-loading': reload }, panelTheme, panelClass]" v-if="!remove">
        <div class="panel-heading" v-bind:class="headerClass">
            <slot name="header"></slot>
            <h4 class="panel-title" v-if="!hasHeaderSlot">
                {{ title }}
            </h4>
            <div class="panel-heading-btn" v-if="!noButton">
                <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" v-on:click="panelExpand"><i class="fa fa-expand"></i></a>
            </div>
        </div>
        <slot name="beforeBody"></slot>
        <div class="panel-body" v-if="!noBody" v-show="!collapse" v-bind:class="bodyClass">
            <slot></slot>
            <div class="panel-loader" v-if="reload">
                <span class="spinner spinner-sm"></span>
            </div>
        </div>
        <slot v-else></slot>
        <slot name="outsideBody"></slot>
        <div class="panel-footer" v-if="hasFooterSlot" v-bind:class="footerClass">
            <slot name="footer"></slot>
        </div>
        <slot name="afterFooter"></slot>
    </div>
</template>

<script>
export default {
    name: 'Panel',
    props: ['title', 'body', 'footer', 'variant', 'noBody', 'noButton', 'outsideBody', 'headerClass', 'bodyClass', 'footerClass', 'panelClass'],
    data() {
        return {
            expand: false,
            collapse: false,
            remove: false,
            reload: false,
            panelTheme: this.variant ? 'panel-' + this.variant : 'panel-inverse',
        }
    },
    computed: {
        hasFooterSlot() {
            return !!this.$slots.footer
        },
        hasHeaderSlot() {
            return !!this.$slots.header
        },
    },
    methods: {
        panelExpand: function () {
            this.expand = !this.expand
        },
        panelCollapse: function () {
            this.collapse = !this.collapse
        },
        panelRemove: function () {
            this.remove = !this.remove
        },
        panelReload: function () {
            this.reload = true
            setTimeout(
                function () {
                    this.resetReload()
                }.bind(this),
                2000,
            )
        },
        resetReload: function () {
            this.reload = false
        },
    },
}
</script>