import { request } from '@umijs/max';

// 查询用户列表
export async function listUser(params?: any) {
  return request('/mgkf/user/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询用户详细
export function getUser(id: number) {
  return request(`/mgkf/user/${id}`, {
    method: 'GET'
  });
}

// 新增用户
export async function addUser(params: any) {
  return request('/mgkf/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改用户
export async function updateUser(params: any) {
  return request('/mgkf/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除用户
export async function delUser(id: string) {
  return request(`/mgkf/user/${id}`, {
    method: 'DELETE'
  });
}
