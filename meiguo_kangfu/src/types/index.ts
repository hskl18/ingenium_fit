/** 接口返回数据类型 */
type IResponseData = {
  code: number;
  data: any;
  msg: string;
};

/** 用户信息类型 */
type IUserInfo = {
  createBy?: any;
  createTime: string;
  updateBy?: any;
  updateTime: string;
  id: string;
  delFlag: number;
  loginPwd: string;
  sex: string;
  name: string;
  whetherPublishPosition: boolean;
  whetherUploadIntermediaryExtraInfo: boolean;
  userRole: string;
  phone: string;
  areaCode: string;
  email?: any;
  avatar: string;
  appleId?: any;
  googleId?: any;
  logoutTime?: any;
  invitationCode: string;
  nickName?: any;
  freeDuration?: any;
};
