package com.ruoyi.mgkf.domain;

import com.ruoyi.mgkf.constant.PublicCommon;
import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * 用户对象 t_user
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class User extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 登录密码 */
    @Excel(name = "登录密码")
    private String loginPwd;

    /** 手机号 */
    @Excel(name = "手机号")
    private String phone;

    /** 区号 */
    @Excel(name = "区号")
    private String areaCode;

    /** 邮箱 */
    @Excel(name = "邮箱")
    private String email;

    /** 头像 */
    @Excel(name = "头像")
    private String avatar;

    /** 账号注销时间 */
    @Excel(name = "账号注销时间")
    private Long logoutTime;

    /** 介绍 */
    @Excel(name = "介绍")
    private String introduction;

    /** 用户昵称 */
    @Excel(name = "用户昵称")
    private String nickName;

    private String firstName;
    private String lastName;

    /**
     * 收藏数量
     */
    private Long collectionNum;

    /**
     * 关注数量
     */
    private Long followingNum;

    /**
     * 粉丝数量
     */
    private Long followersNum;

    private Long createStartTime;

    private Long createEndTime;

    public Long getCreateStartTime() {
        return createStartTime;
    }

    public void setCreateStartTime(Long createStartTime) {
        this.createStartTime = createStartTime;
    }

    public Long getCreateEndTime() {
        return createEndTime;
    }

    public void setCreateEndTime(Long createEndTime) {
        this.createEndTime = createEndTime;
    }

    public Long getCollectionNum() {
        return collectionNum;
    }

    public void setCollectionNum(Long collectionNum) {
        this.collectionNum = collectionNum;
    }

    public Long getFollowingNum() {
        return followingNum;
    }

    public void setFollowingNum(Long followingNum) {
        this.followingNum = followingNum;
    }

    public Long getFollowersNum() {
        return followersNum;
    }

    public void setFollowersNum(Long followersNum) {
        this.followersNum = followersNum;
    }

    private List<Long> userIdList;

    public List<Long> getUserIdList() {
        return userIdList;
    }

    public void setUserIdList(List<Long> userIdList) {
        this.userIdList = userIdList;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId() 
    {
        return id;
    }
    public void setDelFlag(Long delFlag) 
    {
        this.delFlag = delFlag;
    }

    public Long getDelFlag() 
    {
        return delFlag;
    }
    public void setCreateDept(Long createDept) 
    {
        this.createDept = createDept;
    }

    public Long getCreateDept() 
    {
        return createDept;
    }
    public void setLoginPwd(String loginPwd) 
    {
        this.loginPwd = loginPwd;
    }

    public String getLoginPwd() 
    {
        return loginPwd;
    }
    public void setPhone(String phone) 
    {
        this.phone = phone;
    }

    public String getPhone() 
    {
        return phone;
    }
    public void setAreaCode(String areaCode) 
    {
        this.areaCode = areaCode;
    }

    public String getAreaCode() 
    {
        return areaCode;
    }
    public void setEmail(String email) 
    {
        this.email = email;
    }

    public String getEmail() 
    {
        return email;
    }
    public void setAvatar(String avatar) 
    {
        this.avatar = avatar;
    }

    public String getAvatar() 
    {
        return avatar;
    }
    public void setLogoutTime(Long logoutTime) 
    {
        this.logoutTime = logoutTime;
    }

    public Long getLogoutTime() 
    {
        return logoutTime;
    }
    public void setIntroduction(String introduction) 
    {
        this.introduction = introduction;
    }

    public String getIntroduction() 
    {
        return introduction;
    }
    public void setNickName(String nickName) 
    {
        this.nickName = nickName;
    }

    public String getNickName() 
    {
        return nickName;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("delFlag", getDelFlag())
            .append("createDept", getCreateDept())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("loginPwd", getLoginPwd())
            .append("phone", getPhone())
            .append("areaCode", getAreaCode())
            .append("email", getEmail())
            .append("avatar", getAvatar())
            .append("logoutTime", getLogoutTime())
            .append("introduction", getIntroduction())
            .append("nickName", getNickName())
            .toString();
    }

    @Data
    public static class UserRegisterBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -682178945578754518L;

        /** 登录密码 */
        private String loginPwd;

        /** 手机号或邮箱 */
        private String account;

        /** 区号 */
        private String areaCode = PublicCommon.DEFAULT_AREA_CODE;

        /** 验证码 */
        private String captcha;

        private String firstName;
        private String lastName;
    }

    @Data
    public static class ForgotPasswordBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -4765887655476385805L;
        /** 登录密码 */
        private String loginPwd;
        /** 验证码 */
        private String captcha;
        /** 手机号或邮箱 */
        private String account;
        /** 区号 */
        private String areaCode= PublicCommon.DEFAULT_AREA_CODE;
    }

    @Data
    public static class ChangePasswordBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 3262719470202620395L;

        /** 旧密码 */
        private String oldPassword;

        /** 新密码 */
        private String newPassword;
    }
}
