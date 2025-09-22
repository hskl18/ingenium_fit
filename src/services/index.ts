// Export all mock API services for frontend-only demo
export * from "./mock";
export * from "./types";

// Re-export commonly used functions with original names for backward compatibility
// Auth temporarily disabled for demo-only frontend
// import { authApi } from './mock/auth';
import { uploadApi } from "./mock/upload";
import { commonApi } from "./mock/common";
import { userApi } from "./mock/user";
import { postsApi } from "./mock/posts";
import { rehabilitationApi } from "./mock/rehabilitation";
import { messagesApi } from "./mock/messages";

// Auth functions
// export const login = authApi.login;
// export const register = authApi.register;
// export const logout = authApi.logout;
// export const forgotPassword = authApi.forgotPassword;
// export const changePassword = authApi.changePassword;
// export const logOff = authApi.deleteAccount;

// Upload functions
export const uploadFile = uploadApi.uploadFile;

// Common functions
export const locationCity = commonApi.locationCity;
export const sendEmailSmsCode = commonApi.sendEmailSmsCode;
export const sendPhoneSmsCode = commonApi.sendPhoneSmsCode;
export const termsList = commonApi.termsList;
export const carouselList = commonApi.carouselList;
export const carouselDetail = commonApi.carouselDetail;
export const commentList = commonApi.commentList;
export const addComment = commonApi.addComment;
export const addCommentReply = commonApi.addCommentReply;
export const favorite = commonApi.favorite;
export const favoriteList = commonApi.favoriteList;
export const faqsList = commonApi.faqsList;
export const agreementByCode = commonApi.agreementByCode;

// User functions
export const getLoginUser = userApi.getLoginUser;
export const getLoginUserProfile = userApi.getLoginUserProfile;
export const editUserInfo = userApi.editUserInfo;
export const toggleFollow = userApi.toggleFollow;
export const followList = userApi.followList;

// Posts functions
export const postList = postsApi.postList;
export const postDetail = postsApi.postDetail;
export const myPostList = postsApi.myPostList;
export const publishPost = postsApi.publishPost;
export const deletePost = postsApi.deletePost;
export const blockPost = postsApi.blockPost;
export const forwardPost = postsApi.forwardPost;
export const toggleLike = postsApi.toggleLike;
export const dynamicsCategoryList = postsApi.dynamicsCategoryList;

// Rehabilitation functions
export const rehabilitationCenterList =
  rehabilitationApi.rehabilitationCenterList;
export const centerDetail = rehabilitationApi.centerDetail;
export const doctorList = rehabilitationApi.doctorList;
export const doctorDetail = rehabilitationApi.doctorDetail;
export const scienceList = rehabilitationApi.scienceList;
export const scienceDetail = rehabilitationApi.scienceDetail;
export const scienceCategoryList = rehabilitationApi.scienceCategoryList;

// Messages functions
export const messageList = messagesApi.messageList;
export const messageDetail = messagesApi.messageDetail;
export const deleteMessage = messagesApi.deleteMessage;
export const readMessage = messagesApi.readMessage;
export const getUnReadNumAndLatest = messagesApi.getUnReadNumAndLatest;
export const leaveWordList = messagesApi.leaveWordList;
export const leaveWordContentList = messagesApi.leaveWordContentList;
export const leaveWordDetail = messagesApi.leaveWordDetail;
export const sendLeaveWord = messagesApi.sendLeaveWord;
export const getLeaveWordUnReadNumAndLatest =
  messagesApi.getLeaveWordUnReadNumAndLatest;
