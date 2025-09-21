import { request } from '@umijs/max';

// 查询热门搜索词列表
export async function listTerms(params?: any) {
  return request('/mgkf/terms/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    params
  });
}

// 查询热门搜索词详细
export function getTerms(id: number) {
  return request(`/mgkf/terms/${id}`, {
    method: 'GET'
  });
}

// 新增热门搜索词
export async function addTerms(params: any) {
  return request('/mgkf/terms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 修改热门搜索词
export async function updateTerms(params: any) {
  return request('/mgkf/terms', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: params
  });
}

// 删除热门搜索词
export async function delTerms(id: string) {
  return request(`/mgkf/terms/${id}`, {
    method: 'DELETE'
  });
}
