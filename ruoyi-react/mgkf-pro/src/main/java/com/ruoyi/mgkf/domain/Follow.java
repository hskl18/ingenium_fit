package com.ruoyi.mgkf.domain;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * 关注对象 t_follow
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class Follow extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 租户号 */
    private Long id;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 删除标识 1 正常 2 删除 3 禁用 */
    private Long delFlag;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 关注用户id */
    @Excel(name = "关注用户id")
    private Long followUserId;

    /**
     * 关注用户信息/粉丝用户信息
     */
    private User user;

    /**
     * 是否互相关注
     */
    private Boolean whetherMutualFollow;

    /**
     * 用户id列表
     */
    private List<Long> userIdList;

    /**
     * 关注用户id列表
     */
    private List<Long> followUserIdList;

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

    public List<Long> getUserIdList() {
        return userIdList;
    }

    public void setUserIdList(List<Long> userIdList) {
        this.userIdList = userIdList;
    }

    public List<Long> getFollowUserIdList() {
        return followUserIdList;
    }

    public void setFollowUserIdList(List<Long> followUserIdList) {
        this.followUserIdList = followUserIdList;
    }

    public Boolean getWhetherMutualFollow() {
        return whetherMutualFollow;
    }

    public void setWhetherMutualFollow(Boolean whetherMutualFollow) {
        this.whetherMutualFollow = whetherMutualFollow;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId() 
    {
        return id;
    }
    public void setCreateDept(Long createDept) 
    {
        this.createDept = createDept;
    }

    public Long getCreateDept() 
    {
        return createDept;
    }
    public void setDelFlag(Long delFlag) 
    {
        this.delFlag = delFlag;
    }

    public Long getDelFlag() 
    {
        return delFlag;
    }
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
    }
    public void setFollowUserId(Long followUserId) 
    {
        this.followUserId = followUserId;
    }

    public Long getFollowUserId() 
    {
        return followUserId;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("createDept", getCreateDept())
            .append("delFlag", getDelFlag())
            .append("userId", getUserId())
            .append("followUserId", getFollowUserId())
            .toString();
    }

    @Data
    public static class FollowBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 4802558775766747506L;

        /** 关注用户id */
        @NotNull(message = "{followUserId.not.null}")
        private Long followUserId;
    }

    @Data
    public static class FollowListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -550047143749941710L;

        /** 列表类型 1 关注列表 2 粉丝列表 */
        private Integer listType = 1;
    }
}
