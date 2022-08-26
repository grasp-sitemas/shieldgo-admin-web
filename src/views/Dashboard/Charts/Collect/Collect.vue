<template>
    <div id="wrapper" :key="valuekey">
        <div class="col-xl-6">
            <div class="Chart">
                <canvas id="collects" width="30" height="30"></canvas>
            </div>
        </div>
        <div v-if="totalClosed && totalClosed > 0" style="font-size: 15px; text-align: center"><label>Total:</label> {{ totalClosed }}</div>
    </div>
</template>
            
<script>
import Chart from 'chart.js'
import Controller from './CrtCollect'
export default {
    name: 'Collect',
    components: {},

    data() {
        return {
            chart: null,
            total: 0,
            totalClosed: 0,
        }
    },
    methods: Controller.methods,
    created() {
        Controller.init(this)
    },
    mounted() {
        const ctx = document.getElementById('collects')
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        data: null,
                        backgroundColor: ['#26547C', '#FFD166', '#EF476F'],
                    },
                ],
                labels: ['ROLLON', 'TRICICLO', 'PEV'],
            },
            options: {
                title: {
                    display: true,
                },
                legend: {
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        boxWidth: 20,
                    },
                },
            },
        })
        this.filter()
    },
}
</script>