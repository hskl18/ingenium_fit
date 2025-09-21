import { request } from '@umijs/max';

// 查询科普分类列表
export async function listCategory(params?: any) {
  return request('/mgkf/science/category/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询科普分类详细
export function getCategory(id: number) {
  return request(`/mgkf/science/category/${id}`, {
    method: 'GET'
  });
}

// 新增科普分类
export async function addCategory(params: any) {
  return request('/mgkf/science/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改科普分类
export async function updateCategory(params: any) {
  return request('/mgkf/science/category', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除科普分类
export async function delCategory(id: string) {
  return request(`/mgkf/science/category/${id}`, {
    method: 'DELETE'
  });
}
