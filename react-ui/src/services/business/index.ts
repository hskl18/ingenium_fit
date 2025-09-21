import { request } from '@umijs/max';


/**
 * 上传文件
 * @param data
 */
export async function uploadFile(params: any) {
  return request('/app/system/oss/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: params
  });
}


/**
 * 数量模块统计
 */
export async function numberModelStatistics() {
  return request('/mgkf/index/numberModelStatistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 柱状图模块统计
 */
export async function barChartModelStatistics(data:any) {
  return request('/mgkf/index/barChartModelStatistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data
  });
}


/**
 * 排行榜模块统计
 */
export async function rankingListModelStatistics() {
  return request('/mgkf/index/rankingListModelStatistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
