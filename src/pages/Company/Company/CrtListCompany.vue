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

        <panel title="Vue Data Tables" bodyClass="p-0" class="">
            <vue-good-table
                :columns="columns"
                :rows="rows"
                :lineNumbers="true"
                :search-options="{ enabled: true, placeholder: 'Search this table' }"
                :pagination-options="{ enabled: true, position: 'bottom' }"
                :selectOptions="{
                    enabled: true,
                    selectOnCheckboxOnly: true,
                    selectionInfoClass: 'alert alert-info m-b-0 no-rounded-corner',
                    selectionText: 'rows selected',
                    clearSelectionText: 'clear',
                }"
            >
                <div slot="selected-row-actions">
                    <button class="btn btn-xs btn-primary me-2">Action 1</button>
                    <button class="btn btn-xs btn-white">Action 2</button>
                </div>
                <template slot="table-row" slot-scope="props">
                    <span v-if="props.column.field == 'image'">
                        <img v-bind:src="props.row.image" class="rounded my-n1 mx-auto d-block" width="26" />
                    </span>
                    <span v-else>
                        {{ props.formattedRow[props.column.field] }}
                    </span>
                </template>
            </vue-good-table>
        </panel>
    </div>
</template>