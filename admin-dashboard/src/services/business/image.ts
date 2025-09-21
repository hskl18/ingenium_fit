import { request } from '@umijs/max';

// 查询轮播图列表
export async function listImage(params?: any) {
  return request('/mgkf/image/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询轮播图详细
export function getImage(id: number) {
  return request(`/mgkf/image/${id}`, {
    method: 'GET'
  });
}

// 新增轮播图
export async function addImage(params: any) {
  return request('/mgkf/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改轮播图
export async function updateImage(params: any) {
  return request('/mgkf/image', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除轮播图
export async function delImage(id: string) {
  return request(`/mgkf/image/${id}`, {
    method: 'DELETE'
  });
}
