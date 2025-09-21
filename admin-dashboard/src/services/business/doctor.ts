import { request } from '@umijs/max';

// 查询医师列表
export async function listDoctor(params?: any) {
  return request('/mgkf/doctor/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询医师详细
export function getDoctor(id: number) {
  return request(`/mgkf/doctor/${id}`, {
    method: 'GET'
  });
}

// 新增医师
export async function addDoctor(params: any) {
  return request('/mgkf/doctor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改医师
export async function updateDoctor(params: any) {
  return request('/mgkf/doctor', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除医师
export async function delDoctor(id: string) {
  return request(`/mgkf/doctor/${id}`, {
    method: 'DELETE'
  });
}
