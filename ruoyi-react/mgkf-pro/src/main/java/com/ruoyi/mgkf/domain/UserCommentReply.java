package com.ruoyi.mgkf.domain;

import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * 评论回复对象 t_user_comment_reply
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class UserCommentReply extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 用户评论表id */
    @Excel(name = "用户评论表id")
    private Long userCommentId;

    /** 回复内容 */
    @Excel(name = "回复内容")
    private String content;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 回复用户id */
    @Excel(name = "回复用户id")
    private Long replyUserId;

    /**
     * 用户信息
     */
    private User user;

    /**
     * 回复用户信息
     */
    private User replyUser;

    /**
     * 用户评论表id列表
     */
    private List<Long> userCommentIdList;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getReplyUser() {
        return replyUser;
    }

    public void setReplyUser(User replyUser) {
        this.replyUser = replyUser;
    }

    public List<Long> getUserCommentIdList() {
        return userCommentIdList;
    }

    public void setUserCommentIdList(List<Long> userCommentIdList) {
        this.userCommentIdList = userCommentIdList;
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
    public void setUserCommentId(Long userCommentId) 
    {
        this.userCommentId = userCommentId;
    }

    public Long getUserCommentId() 
    {
        return userCommentId;
    }
    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
    }
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
    }
    public void setReplyUserId(Long replyUserId) 
    {
        this.replyUserId = replyUserId;
    }

    public Long getReplyUserId() 
    {
        return replyUserId;
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
            .append("userCommentId", getUserCommentId())
            .append("content", getContent())
            .append("userId", getUserId())
            .append("replyUserId", getReplyUserId())
            .toString();
    }

    @Data
    public static class UserCommentReplyBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 6400128002273060579L;

        /** 用户评论表id */
        private Long userCommentId;

        /** 回复内容 */
        private String content;

        /** 回复用户id, 回复一级评论不用传 */
        private Long replyUserId;
    }
}
