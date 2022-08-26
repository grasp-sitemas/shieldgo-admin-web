<template>
    <footer class="footer">
        <div class="container-fluid" style="text-align: -webkit-center">
            <div class="row footer-row">
                <label class="footer-label">{{ $t('string.msg.footer.label.copyright') + new Date().getFullYear() }}</label
                ><br />
                <label class="footer-label"
                    >{{ $t('string.msg.footer.development.by') + ' ' }}
                    <a class="footer-brand" href="http://www.grasp.com.br" target="_blank">
                        <strong class="footer-label-strong">{{ $t('string.msg.footer.development.brand') }}</strong></a
                    >
                </label>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
}
</script>

<style scoped>
</style>