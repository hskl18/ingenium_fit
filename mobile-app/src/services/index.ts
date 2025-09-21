import { instance } from '@/services/instance';
import i18n from '@/translations';
import { Configs } from '@/common/configs.ts';

const PAGE_SIZE = process.env.PAGE_SIZE ?? '10';

export const locationCity = async ({ latitude, longitude }) => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('latlng', `${latitude},${longitude}`);
  searchParameters.set('key', Configs.GoogleApiKey);
  searchParameters.set(
    'language',
    i18n.language === 'zh-Hans' ? 'zh-CN' : i18n.language,
  );
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${searchParameters.toString()}`;

  return instance.get(url, {prefixUrl: ''}).json();
};

/**
 * 上传文件
 * @param data
 */
export const uploadFile = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/system/oss/upload', {
      headers: {
        'content-type': 'multipart/form-data',
      },
      body: data,
    })
    .json();
}; /**
 * 发送邮箱验证码
 * @param data
 */
export const sendEmailSmsCode = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/sms/email/send', {
      json: data,
    })
    .json();
};

/**
 * 查询热门搜索词列表
 * @param data
 */
export const termsList = async (data = {}): Promise<IResponseData> => {
  return instance
    .post('app/terms/list', {
      json: data,
    })
    .json();
};
/**
 * 转发帖子
 * @param data
 */
export const forwardPost = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/post/forward', {
      json: data,
    })
    .json();
};

/**
 * 发送手机短信验证码
 * @param data
 */
export const sendPhoneSmsCode = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/sms/phone/send', {
      json: data,
    })
    .json();
};

export const register = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/register', {
      json: data,
    })
    .json();
};

export const login = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/login', {
      json: data,
    })
    .json();
};
/**
 * 退出登录
 */
export const logout = async (): Promise<IResponseData> => {
  return instance.post('app/user/logout').json();
};

/**
 * 注销账号
 */
export const logOff = async (): Promise<IResponseData> => {
  return instance.post('app/user/logOff').json();
};

/**
 * 修改密码
 * @param data
 */
export const changePassword = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/changePassword', {
      json: data,
    })
    .json();
};
/**
 * 忘记密码
 * @param data
 */
export const forgotPassword = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/forgotPassword', {
      json: data,
    })
    .json();
};

/**
 * 查询轮播图列表
 */
export const carouselList = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/image/list', {
      json: data,
    })
    .json();
};

/**
 * 获取轮播图详细信息
 */
export const carouselDetail = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/image/detail', {
      json: data,
    })
    .json();
};

/**
 * 修改用户信息
 */
export const editUserInfo = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/editUserInfo', {
      json: data,
    })
    .json();
};
/**
 * 获取登录用户信息
 */
export const getLoginUser = async (): Promise<IResponseData> => {
  return instance.get('app/user/getLoginUser').json();
};
/**
 * 查询登录用户统计数量
 */
export const getLoginUserProfile = async (): Promise<IResponseData> => {
  return instance.post('app/user/profile/count').json();
};

/**
 * 点赞/取消点赞
 */
export const toggleLike = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/like', {
      json: data,
    })
    .json();
};

/**
 * 新增/取消关注
 */
export const toggleFollow = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/follow', {
      json: data,
    })
    .json();
};

/**
 * 查询关注列表
 * @param data
 */
export const followList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize || PAGE_SIZE);
  const url = `app/follow/list?${searchParameters.toString()}`;

  return instance
    .post(url, {
      json: data,
    })
    .json();
};

/**
 * 查询留言列表
 * @param data
 */
export const leaveWordList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? '1');
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);
  const url = `app/leave/word/list?${searchParameters.toString()}`;

  return instance
    .post(url, {
      json: data,
    })
    .json();
};

/**
 * 查询留言内容列表
 * @param data
 */
export const leaveWordContentList = async (
  data: any,
): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.append('current', data.page ?? 1);
  searchParameters.append('pageSize', data?.pageSize ?? PAGE_SIZE);
  const url = `app/leave/word/content/list?${searchParameters.toString()}`;

  return instance
    .post(url, {
      json: data,
    })
    .json();
};

/**
 * 获取留言信息
 */
export const leaveWordDetail = async (data): Promise<IResponseData> => {
  return instance
    .post('app/leave/word/detail', {
      json: data,
    })
    .json();
};

/**
 * 发送留言
 */
export const sendLeaveWord = async (data): Promise<IResponseData> => {
  return instance
    .post('app/leave/word/content/send', {
      json: data,
    })
    .json();
};
/**
 * 查询未读消息数量和最新一条留言
 */
export const getLeaveWordUnReadNumAndLatest =
  async (): Promise<IResponseData> => {
    return instance.post('app/leave/word/unReadNumAndLatest').json();
  };

/**
 * 查询用户消息列表
 * @param data
 */
export const messageList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? '1');
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);

  return instance
    .post('app/user/message/list', {
      json: data,
    })
    .json();
};

/**
 * 查询未读消息数量和最新一条消息
 */
export const getUnReadNumAndLatest = async (): Promise<IResponseData> => {
  return instance.post('app/user/message/unReadNumAndLatest').json();
};

/**
 * 查询科普分类列表
 */
export const scienceCategoryList = async (): Promise<IResponseData> => {
  return instance
    .post('app/science/category/list', {
      json: {},
    })
    .json();
};

/**
 * 获取用户消息详细信息
 */
export const messageDetail = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/message/detail', {
      json: data,
    })
    .json();
};

/**
 * 删除用户消息
 */
export const deleteMessage = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/message/delete', {
      json: data,
    })
    .json();
};

/**
 * 一键已读消息
 */
export const readMessage = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/user/message/oneClickRead', {
      json: data,
    })
    .json();
};

/**
 * 获取协议
 */
export const agreementByCode = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/agreement/getByCode', {
      json: data,
    })
    .json();
};

/**
 * 查询康复中心列表
 * @param data
 */
export const rehabilitationCenterList = async (
  data: any,
): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? '1');
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);
  const url = `app/center/list?${searchParameters.toString()}`;

  return instance
    .post(url, {
      json: data,
    })
    .json();
};
/**
 * 查询医师列表
 * @param data
 */
export const doctorList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? '1');
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);
  const url = `app/doctor/list?${searchParameters.toString()}`;

  return instance
    .post(url, {
      json: data,
    })
    .json();
};

/**
 * 获取医师详细信息
 */
export const doctorDetail = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/doctor/detail', {
      json: data,
    })
    .json();
};

/**
 * 查询动态帖子列表
 * @param data
 */
export const postList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);
  const url = `app/post/list?${searchParameters.toString()}`;

  return instance
    .post(url, {
      json: data,
    })
    .json();
};

/**
 * 获取动态帖子详细信息
 */
export const postDetail = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/post/detail', {
      json: data,
    })
    .json();
};
/**
 * 获取康复中心详细信息
 */
export const centerDetail = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/center/detail', {
      json: data,
    })
    .json();
};
/**
 * 新增评论回复
 */
export const addCommentReply = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/comment/add/reply', {
      json: data,
    })
    .json();
};
/**
 * 新增评论|评价
 */
export const addComment = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/comment', {
      json: data,
    })
    .json();
};

/**
 * 我的动态帖子列表
 * @param data
 */
export const myPostList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);
  return instance
    .post(`app/post/my/list?${searchParameters.toString()}`, {
      json: data,
    })
    .json();
};
/**
 * 查询用户评论列表
 * @param data
 */
export const commentList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);

  return instance
    .post(`app/comment/list?${searchParameters.toString()}`, {
      json: data,
    })
    .json();
};

/**
 * 查询常见问题列表
 * @param data
 */
export const faqsList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);

  return instance
    .post(`app/faqs/list?${searchParameters.toString()}`, {
      json: data,
    })
    .json();
};

/**
 * 收藏/取消收藏
 * @param data
 */
export const favorite = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/favorite', {
      json: data,
    })
    .json();
};

/**
 * 查询收藏列表
 * @param data
 */
export const favoriteList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);

  return instance
    .post(`app/favorite/list?${searchParameters.toString()}`, {
      json: data,
    })
    .json();
};
/**
 * 查询科普列表
 * @param data
 */
export const scienceList = async (data: any): Promise<IResponseData> => {
  const searchParameters = new URLSearchParams();
  searchParameters.set('current', data.page ?? 1);
  searchParameters.set('pageSize', data?.pageSize ?? PAGE_SIZE);

  return instance
    .post(`app/science/list?${searchParameters.toString()}`, {
      json: data,
    })
    .json();
};

/**
 * 获取科普详细信息
 * @param data
 */
export const scienceDetail = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/science/detail', {
      json: data,
    })
    .json();
};

/**
 * 查询动态帖子分类列表
 */
export const dynamicsCategoryList = async (
  data: any,
): Promise<IResponseData> => {
  return instance
    .post('app/dynamicsPost/category/list', {
      json: data,
    })
    .json();
};
/**
 * 发布动态帖子
 * @param data
 */
export const publishPost = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/post/publish', {
      json: data,
    })
    .json();
};
/**
 * 删除动态帖子
 * @param data
 */
export const deletePost = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/post/delete', {
      json: data,
    })
    .json();
};
/**
 * 屏蔽动态帖子/取消屏蔽
 * @param data
 */
export const blockPost = async (data: any): Promise<IResponseData> => {
  return instance
    .post('app/post/block', {
      json: data,
    })
    .json();
};
