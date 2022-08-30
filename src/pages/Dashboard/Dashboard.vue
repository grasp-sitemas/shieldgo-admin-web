<template>
    <div>
        <!-- BEGIN breadcrumb -->
        <ol class="breadcrumb float-xl-end">
            <li class="breadcrumb-item active">
                <a href="javascript:;">{{ $t('str.breadcrumb.dashboard') }}</a>
            </li>
        </ol>
        <!-- END breadcrumb -->
        <!-- BEGIN page-header -->
        <h1 class="page-header">
            {{ $t('str.title.dashboard') }}
            <!-- <small>header small text goes here...</small> -->
        </h1>
        <!-- END page-header -->

        <!-- BEGIN panel -->
        <panel title="Panel title here"> Panel Content Here </panel>
        <!-- END panel -->
    </div>
</template>