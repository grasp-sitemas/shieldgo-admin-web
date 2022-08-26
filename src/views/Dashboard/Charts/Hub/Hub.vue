<template>
    <div id="wrapper" :key="valuekey">
        <div class="col-xl-6">
            <div class="Chart">
                <canvas id="hubs" width="30" height="30"></canvas>
            </div>
        </div> 
        <div v-if="total && total > 0" style="font-size:15px; text-align:center;">
            <label>Total:</label> {{total}}
        </div>
    </div>
</template>
            
<script>  
import Chart from 'chart.js';
import Controller from './CrtHub';
export default {
  
    name: 'Hub',
    components: {
    },
    
    data() {
    return {
      chart: null,
      total: 0,

      }
    },
    methods: Controller.methods,
    created() {
      Controller.init(this);
    },
    mounted() {

        const ctx = document.getElementById('hubs');
        this.chart = new Chart(ctx, {

          type: 'doughnut',
          data: {
            datasets: [{  
                    data: null,
                    backgroundColor: ["#FFD166","#06D6A0"],
                }],

            labels: ['ROLLON','PEV'],
        },
        options: {
            /*responsive: true,
            events: false,
            tooltips: {
                enabled: false
            },
            hover: {
                animationDuration: 0
            },*/
            title: {
                display: true, 
            },
            legend: {
                fullWidth: true,
                labels: {
                    fontColor: '#000',
                    boxWidth: 20, 
                }
            },
            /*animation: {
                onComplete: function () {
                    var chartInstance = this.chart,
                    ctx = chartInstance.ctx;
                    ctx.font = Chart.helpers.fontString(10, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'center';

                    this.data.datasets.forEach(function (dataset, i) {
                        var meta = chartInstance.controller.getDatasetMeta(i);
                        meta.data.forEach(function (bar, index) {
                            var data = dataset.data[index];
                            ctx.fillText(data, bar._model.x, bar._model.y - 5);
                        });
                    });
                }
            }*/
        }
      });
      this.filter();
    }
}
    

</script>