<template>
  <div class="app-container">
    <div class="page-title">聚类可视化</div>
    
    <el-form :model="form" ref="form" label-width="120px" class="visualization-form">
      <el-form-item label="聚类个数">
        <el-input-number 
          v-model="form.cluster_num" 
          :min="2" 
          :max="10"
          controls-position="right"
          placeholder="请输入聚类个数">
        </el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </el-form-item>
    </el-form>

    <div class="charts-container" v-if="showCharts">
      <div class="chart-wrapper">
        <!-- <div class="chart-title">簇样本数分布</div> -->
        <div ref="clusterSizeChart" style="width: 100%; height: 400px;"></div>
      </div>
      
      <div class="chart-wrapper">
        <!-- <div class="chart-title">TSNE降维可视化</div> -->
        <div ref="tsneChart" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getExperimentInfo } from '@/api/experiment'

export default {
  name: 'Visualization',
  data() {
    return {
      form: {
        cluster_num: 2
      },
      showCharts: false,
      clusterSizeChart: null,
      tsneChart: null
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await getExperimentInfo(this.form.cluster_num)
        const respData = response.data
        if (respData.code === 0) {
          this.showCharts = true
          this.$nextTick(() => {
            this.initCharts()
            this.updateCharts(respData.data)
          })
        } else {
          this.$message.error(respData.msg || '获取数据失败')
        }
      } catch (error) {
        console.error('获取数据失败：', error)
        this.$message.error('获取数据失败，请重试')
      }
    },
    initCharts() {
      if (this.$refs.clusterSizeChart) {
        this.clusterSizeChart = echarts.init(this.$refs.clusterSizeChart)
      }
      if (this.$refs.tsneChart) {
        this.tsneChart = echarts.init(this.$refs.tsneChart)
      }
    },
    updateCharts(data) {
      // 更新簇样本数分布图
      if (this.clusterSizeChart) {
        const clusterSizeOption = {
          title: {
            text: '簇样本数分布'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: Object.keys(data.cluster_counts),
            name: '簇索引'
          },
          yAxis: {
            type: 'value',
            name: '样本数'
          },
          series: [{
            data: Object.values(data.cluster_counts),
            type: 'bar',
            barWidth: '60%'
          }]
        }
        this.clusterSizeChart.setOption(clusterSizeOption)
      }

      // 更新TSNE降维可视化图
      if (this.tsneChart) {
        const tsneOption = {
          title: {
            text: 'TSNE降维可视化'
          },
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              return `簇 ${params.data.cluster_id}`
            }
          },
          xAxis: {
            type: 'value',
            name: 'X坐标'
          },
          yAxis: {
            type: 'value',
            name: 'Y坐标'
          },
          series: [{
            type: 'scatter',
            data: data.tsne_result.map(item => ({
              value: [item.x, item.y],
              cluster_id: item.cluster_id,
              itemStyle: {
                color: this.getClusterColor(item.cluster_id)
              }
            }))
          }]
        }
        this.tsneChart.setOption(tsneOption)
      }
    },
    getClusterColor(clusterIndex) {
      const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
      return colors[clusterIndex % colors.length]
    }
  },
  beforeDestroy() {
    if (this.clusterSizeChart) {
      this.clusterSizeChart.dispose()
    }
    if (this.tsneChart) {
      this.tsneChart.dispose()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  
  .page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .visualization-form {
    max-width: 600px;
    margin-bottom: 40px;
  }
  
  .charts-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    
    .chart-wrapper {
      .chart-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
