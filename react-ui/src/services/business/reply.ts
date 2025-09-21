import { request } from '@umijs/max';

// 查询评论回复列表
export async function listReply(params?: any) {
  return request('/mgkf/reply/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询评论回复详细
export function getReply(id: number) {
  return request(`/mgkf/reply/${id}`, {
    method: 'GET'
  });
}

// 新增评论回复
export async function addReply(params: any) {
  return request('/mgkf/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改评论回复
export async function updateReply(params: any) {
  return request('/mgkf/reply', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除评论回复
export async function delReply(id: string) {
  return request(`/mgkf/reply/${id}`, {
    method: 'DELETE'
  });
}