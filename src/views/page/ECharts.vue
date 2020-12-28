<template>
    <div>
        <div class="content-title">环形图</div>
        <ve-line width="500px" :data="chartData"></ve-line>
    </div>
</template>

<script>
    import VeLine from 'v-charts/lib/line.common'
    export default {
        components: { VeLine },
        data () {
            return {
                chartData: {
                    columns: ['date', 'PV'],
                    rows: [
                        { 'date': '01-01', 'PV': 1231 },
                        { 'date': '01-02', 'PV': 1223 },
                        { 'date': '01-03', 'PV': 2123 },
                        { 'date': '01-04', 'PV': 4123 },
                        { 'date': '01-05', 'PV': 3123 },
                        { 'date': '01-06', 'PV': 7123 }
                    ]
                }
            }
        }
    }
</script>

<style scoped>
    .schart-box {
        display: inline-block;
        margin: 20px;
    }
    .schart {
        width: 600px;
        height: 400px;
    }
    .content-title {
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
</style>