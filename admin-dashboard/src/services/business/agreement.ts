import { request } from '@umijs/max';

// 查询协议列表
export async function listAgreement(params?: any) {
  return request('/mgkf/agreement/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询协议详细
export function getAgreement(id: number) {
  return request(`/mgkf/agreement/${id}`, {
    method: 'GET'
  });
}

// 新增协议
export async function addAgreement(params: any) {
  return request('/mgkf/agreement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改协议
export async function updateAgreement(params: any) {
  return request('/mgkf/agreement', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除协议
export async function delAgreement(id: string) {
  return request(`/mgkf/agreement/${id}`, {
    method: 'DELETE'
  });
}
