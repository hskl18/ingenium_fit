import { request } from '@umijs/max';

// 查询科普列表
export async function listScience(params?: any) {
  return request('/mgkf/science/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询科普详细
export function getScience(id: number) {
  return request(`/mgkf/science/${id}`, {
    method: 'GET'
  });
}

// 新增科普
export async function addScience(params: any) {
  return request('/mgkf/science', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改科普
export async function updateScience(params: any) {
  return request('/mgkf/science', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除科普
export async function delScience(id: string) {
  return request(`/mgkf/science/${id}`, {
    method: 'DELETE'
  });
}
