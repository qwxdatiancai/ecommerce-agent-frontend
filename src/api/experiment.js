import request from '@/utils/request'

// 创建实验
export function createExperiment(data) {
  return request({
    url: '/v1/experiment/create',
    method: 'post',
    timeout: 300 * 1000,
    data
  })
}

// 获取实验信息
export function getExperimentInfo(clusterNum) {
  return request({
    url: '/v1/experiment/info',
    method: 'post',
    timeout: 10 * 1000,
    data: {
      cluster_num: clusterNum
    }
  })
}
