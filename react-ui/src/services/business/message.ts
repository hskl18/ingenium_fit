import { request } from '@umijs/max';

// 查询系统消息列表
export async function listMessage(params?: any) {
  return request('/mgkf/message/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询系统消息详细
export function getMessage(id: number) {
  return request(`/mgkf/message/${id}`, {
    method: 'GET'
  });
}

// 新增系统消息
export async function addMessage(params: any) {
  return request('/mgkf/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改系统消息
export async function updateMessage(params: any) {
  return request('/mgkf/message', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除系统消息
export async function delMessage(id: string) {
  return request(`/mgkf/message/${id}`, {
    method: 'DELETE'
  });
}
