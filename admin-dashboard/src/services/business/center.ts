import { request } from '@umijs/max';

// 查询康复中心列表
export async function listCenter(params?: any) {
  return request('/mgkf/center/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询康复中心详细
export function getCenter(id: number) {
  return request(`/mgkf/center/${id}`, {
    method: 'GET'
  });
}

// 新增康复中心
export async function addCenter(params: any) {
  return request('/mgkf/center', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改康复中心
export async function updateCenter(params: any) {
  return request('/mgkf/center', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除康复中心
export async function delCenter(id: string) {
  return request(`/mgkf/center/${id}`, {
    method: 'DELETE'
  });
}
