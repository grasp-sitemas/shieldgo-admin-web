<template>
    <div class="col-md-12">
        <div class="card border-0 pb-2 text-truncate mb-3 bg-gray-800 text-white">
            <div class="card-body">
                <div class="mb-3 text-gray-500">
                    <b class="mb-3">{{ title.toUpperCase() }}</b>
                </div>
                <div class="d-flex align-items-center mb-1">
                    <h2 class="text-white mb-0">
                        <span>{{ data?.attendanceCount }}</span>
                    </h2>
                </div>
                <div class="d-flex mt-2">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-circle text-lime fs-8px me-2"></i>
                        {{ $t('str.msg.performance.min') }}
                    </div>
                    <div class="d-flex align-items-center ms-auto">
                        <div class="w-50px text-end ps-2 fw-bold">{{ data.min }}</div>
                    </div>
                </div>
                <div class="d-flex">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-circle text-warning fs-8px me-2"></i>
                        {{ $t('str.msg.performance.avg') }}
                    </div>
                    <div class="d-flex align-items-center ms-auto">
                        <div class="w-50px text-end ps-2 fw-bold">{{ data.avg }}</div>
                    </div>
                </div>
                <div class="d-flex">
                    <div class="d-flex align-items-center">
                        <i class="fa fa-circle text-red fs-8px me-2"></i>
                        {{ $t('str.msg.performance.max') }}
                    </div>
                    <div class="d-flex align-items-center ms-auto">
                        <div class="w-50px text-end ps-2 fw-bold">{{ data.max }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AverageTimeAttendanceEvent',
    props: {
        data: {
            type: Object,
            default: () => ({
                attendanceCount: 0,
                avg: '00:00:00',
                min: '00:00:00',
                max: '00:00:00',
            }),
        },
        title: {
            type: String,
            default: '',
        },
    },
}
</script>
