<template>
    <div class="col-md-12">
        <div class="card border-0 text-truncate mb-3 pb-4 bg-gray-800 text-white">
            <div class="card-body">
                <div class="mb-3 text-gray-500">
                    <b class="mb-3">{{ title.toUpperCase() }}</b>
                </div>
                <div class="d-flex align-items-center mb-2">
                    <h2 class="text-white mb-0">
                        <span>{{ data?.total }}</span>
                    </h2>
                </div>
                <div class="d-flex">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-circle text-lime fs-8px me-2"></i>
                        {{ $t('str.event.attended') }}
                    </div>
                    <div class="d-flex align-items-center ms-auto">
                        <div class="w-50px text-end ps-2 fw-bold">{{ data?.attendance }}</div>
                    </div>
                </div>

                <div class="d-flex">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-circle text-red fs-8px me-2"></i>
                        {{ $t('str.event.not.attended') }}
                    </div>
                    <div class="d-flex align-items-center ms-auto">
                        <div class="w-50px text-end ps-2 fw-bold">{{ data?.notAttendance }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AttendanceEvents',
    props: {
        data: {
            type: Object,
            default: () => ({
                total: 0,
                attendance: 0,
                notAttendance: 0,
            }),
        },
        title: {
            type: String,
            default: '',
        },
    },
}
</script>
