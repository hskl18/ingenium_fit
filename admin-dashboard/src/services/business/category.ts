import { request } from '@umijs/max';

// 查询动态帖子分类列表
export async function listCategory(params?: any) {
  return request('/mgkf/dynamicsPost/category/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询动态帖子分类详细
export function getCategory(id: number) {
  return request(`/mgkf/dynamicsPost/category/${id}`, {
    method: 'GET'
  });
}

// 新增动态帖子分类
export async function addCategory(params: any) {
  return request('/mgkf/dynamicsPost/category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改动态帖子分类
export async function updateCategory(params: any) {
  return request('/mgkf/dynamicsPost/category', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除动态帖子分类
export async function delCategory(id: string) {
  return request(`/mgkf/dynamicsPost/category/${id}`, {
    method: 'DELETE'
  });
}
