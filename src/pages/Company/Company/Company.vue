<template>
    <div>
        <!-- BEGIN breadcrumb -->
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item">
                <a href="javascript:;">{{ $t('str.breadcrumb.companies') }}</a>
            </li>
        </ol>

        <h1 class="page-header">
            {{ $t('str.form.title.companies') }}
            <!-- <small>header small text goes here...</small> -->
        </h1>

        <listCompany />
    </div>
</template>

<script>
import ListCompany from './ListCompany.vue'

export default {
    components: {
        ListCompany,
    },
    data() {
        return {}
    },
}
</script>
