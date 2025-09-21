import { request } from '@umijs/max';

// 查询动态帖子列表
export async function listPost(params?: any) {
  return request('/mgkf/post/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询动态帖子详细
export function getPost(id: number) {
  return request(`/mgkf/post/${id}`, {
    method: 'GET'
  });
}

// 新增动态帖子
export async function addPost(params: any) {
  return request('/mgkf/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改动态帖子
export async function updatePost(params: any) {
  return request('/mgkf/post', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除动态帖子
export async function delPost(id: string) {
  return request(`/mgkf/post/${id}`, {
    method: 'DELETE'
  });
}
