import { request } from '@umijs/max';

// 查询常见问题列表
export async function listFaqs(params?: any) {
  return request('/mgkf/faqs/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询常见问题详细
export function getFaqs(id: number) {
  return request(`/mgkf/faqs/${id}`, {
    method: 'GET'
  });
}

// 新增常见问题
export async function addFaqs(params: any) {
  return request('/mgkf/faqs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改常见问题
export async function updateFaqs(params: any) {
  return request('/mgkf/faqs', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除常见问题
export async function delFaqs(id: string) {
  return request(`/mgkf/faqs/${id}`, {
    method: 'DELETE'
  });
}
