import { request } from '@umijs/max';

// 查询用户评论列表
export async function listComment(params?: any) {
  return request('/mgkf/comment/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询用户评论详细
export function getComment(id: number) {
  return request(`/mgkf/comment/${id}`, {
    method: 'GET'
  });
}

// 新增用户评论
export async function addComment(params: any) {
  return request('/mgkf/comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改用户评论
export async function updateComment(params: any) {
  return request('/mgkf/comment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除用户评论
export async function delComment(id: string) {
  return request(`/mgkf/comment/${id}`, {
    method: 'DELETE'
  });
}