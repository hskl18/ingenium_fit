package com.ruoyi.mgkf.domain;

import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.io.Serial;
import java.io.Serializable;

/**
 * 留言子对象 t_leave_word_sub
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class LeaveWordSub extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 租户号 */
    private Long id;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 删除标识 1 正常 2 删除 3 禁用 */
    private Long delFlag;

    /** 发送消息用户id */
    @Excel(name = "发送消息用户id")
    private Long sendUserId;

    /** 留言id */
    @Excel(name = "留言id")
    private Long leaveWordId;

    /** 消息内容 */
    @Excel(name = "消息内容")
    private String messageContent;

    /** 消息类型：1-文字 2-图片 3-语音 */
    @Excel(name = "消息类型：1-文字 2-图片 3-语音")
    private Long messageType;

    /** 是否已读：1-已读 2-未读 */
    @Excel(name = "是否已读：1-已读 2-未读")
    private Long isRead;

    /**
     * 时长
     */
    private String duration;

    /** 用户头像 */
    private String userAvatar;

    private Long createStartTime;

    private Long createEndTime;

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

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

    public String getUserAvatar() {
        return userAvatar;
    }

    public void setUserAvatar(String userAvatar) {
        this.userAvatar = userAvatar;
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
    public void setSendUserId(Long sendUserId) 
    {
        this.sendUserId = sendUserId;
    }

    public Long getSendUserId() 
    {
        return sendUserId;
    }
    public void setLeaveWordId(Long leaveWordId) 
    {
        this.leaveWordId = leaveWordId;
    }

    public Long getLeaveWordId() 
    {
        return leaveWordId;
    }
    public void setMessageContent(String messageContent) 
    {
        this.messageContent = messageContent;
    }

    public String getMessageContent() 
    {
        return messageContent;
    }
    public void setMessageType(Long messageType) 
    {
        this.messageType = messageType;
    }

    public Long getMessageType() 
    {
        return messageType;
    }
    public void setIsRead(Long isRead) 
    {
        this.isRead = isRead;
    }

    public Long getIsRead() 
    {
        return isRead;
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
            .append("sendUserId", getSendUserId())
            .append("leaveWordId", getLeaveWordId())
            .append("messageContent", getMessageContent())
            .append("messageType", getMessageType())
            .append("isRead", getIsRead())
            .toString();
    }

    @Data
    public static class LeaveWordSubListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 2589361297885705277L;

        /** 留言id */
        private Long leaveWordId;
    }

    @Data
    public static class LeaveWordSubBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -9162191585446539897L;

        /** 留言id */
        private Long leaveWordId;

        /** 消息内容 */
        private String messageContent;

        /** 消息类型：1-文字 2-图片 3-语音 */
        private Long messageType;

        /**
         * 时长
         */
        private String duration;
    }
}
