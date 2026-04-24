<template>
  <div class="app-container" v-loading="loading" element-loading-text="训练中，请稍候...">
    <div class="page-title">聚类模型训练</div>
    
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="training-form">
      <!-- <el-form-item label="训练集文件" prop="file">
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          :on-change="handleFileChange"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :disabled="loading">
          <el-button size="small" type="primary" :disabled="loading">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">请上传CSV格式的训练数据文件</div>
        </el-upload>
      </el-form-item> -->

      <el-form-item label="聚类个数">
        <div class="cluster-range">
          <el-input-number 
            v-model="form.min_clusters" 
            :min="2" 
            :max="form.max_clusters"
            controls-position="right"
            placeholder="最小值"
            :disabled="loading">
          </el-input-number>
          <span class="range-separator">至</span>
          <el-input-number 
            v-model="form.max_clusters" 
            :min="form.min_clusters" 
            :max="10"
            controls-position="right"
            placeholder="最大值"
            :disabled="loading">
          </el-input-number>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" :loading="loading" :disabled="loading">开始训练</el-button>
      </el-form-item>
    </el-form>

    <div class="chart-container" v-if="showChart">
      <div ref="silhouetteChart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { createExperiment } from '@/api/experiment'

export default {
  name: 'Training',
  data() {
    return {
      form: {
        // file: null,
        min_clusters: 2,
        max_clusters: 20
      },
      rules: {
        // file: [
        //   { required: true, message: '请上传训练数据文件', trigger: 'change' }
        // ]
      },
      // fileList: [],
      showChart: false,
      chart: null,
      loading: false
    }
  },
  mounted() {
    // 初始化图表
    this.initChart()
  },
  methods: {
    // handleFileChange(file, fileList) {
    //   this.form.file = file.raw
    // },
    // handleRemove(file, fileList) {
    //   this.form.file = null
    // },
    // handlePreview(file) {
    //   console.log(file)
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning('只能上传一个文件')
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm('确定移除该文件？')
    // },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // if (!this.form.file) {
          //   this.$message.error('请上传训练数据文件')
          //   return
          // }
          
          try {
            this.loading = true
            // 创建 FormData 对象
            const formData = new FormData()
            // formData.append('file', this.form.file)
            formData.append('min_clusters', this.form.min_clusters)
            formData.append('max_clusters', this.form.max_clusters)
            
            // 调用创建实验接口
            const response = await createExperiment(formData)
            const respData = response.data
            
            if (respData.code === 0) {
              this.$message.success('训练完成')
              this.showChart = true
              
              // 处理返回的数据
              const chartData = {
                xAxis: respData.data.map(item => item.cluster_num),
                yAxis: respData.data.map(item => item.silhouette_score)
              }
              
              // 更新图表
              this.$nextTick(() => {
                this.initChart()
                this.updateChart(chartData)
              })
            } else {
              this.$message.error(response.msg || '训练失败')
            }
          } catch (error) {
            console.error('训练过程出错：', error)
            this.$message.error('训练过程出错，请重试')
          } finally {
            this.loading = false
          }
        }
      })
    },
    initChart() {
      if (this.$refs.silhouetteChart) {
        this.chart = echarts.init(this.$refs.silhouetteChart)
      }
    },
    updateChart(data) {
      if (!this.chart) {
        this.initChart()
      }
      if (this.chart) {
        const option = {
          title: {
            text: '聚类参数与轮廓系数关系图'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: data.xAxis,
            name: '聚类个数'
          },
          yAxis: {
            type: 'value',
            name: '轮廓系数',
            min: 0,
            max: 1
          },
          series: [{
            data: data.yAxis,
            type: 'line',
            smooth: true,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            }
          }]
        }
        
        this.chart.setOption(option)
      }
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  position: relative;
  min-height: 500px;  // 添加最小高度以确保loading遮罩层显示正常
  
  .page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .training-form {
    max-width: 600px;
    margin-bottom: 40px;
  }
  
  .chart-container {
    margin-top: 40px;
    
    .chart-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }

  .cluster-range {
    display: flex;
    align-items: center;
    gap: 10px;

    .range-separator {
      color: #606266;
    }
  }
}
</style>
