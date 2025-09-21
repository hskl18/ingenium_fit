import { request } from '@umijs/max';

// 查询留言列表
export async function listWord(params?: any) {
  return request('/mgkf/word/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询留言详细
export function getWord(id: number) {
  return request(`/mgkf/word/${id}`, {
    method: 'GET'
  });
}

// 新增留言
export async function addWord(params: any) {
  return request('/mgkf/word', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改留言
export async function updateWord(params: any) {
  return request('/mgkf/word', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除留言
export async function delWord(id: string) {
  return request(`/mgkf/word/${id}`, {
    method: 'DELETE'
  });
}
