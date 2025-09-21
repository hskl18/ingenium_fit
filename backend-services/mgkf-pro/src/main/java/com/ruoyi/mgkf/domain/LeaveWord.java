package com.ruoyi.mgkf.domain;

import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.io.Serial;
import java.io.Serializable;

/**
 * 留言对象 t_leave_word
 *
 * @author ruoyi
 * @date 2025-08-15
 */
public class LeaveWord extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 租户号
     */
    private Long id;

    /**
     * 创建部门
     */
    @Excel(name = "创建部门")
    private Long createDept;

    /**
     * 删除标识 1 正常 2 删除 3 禁用
     */
    private Long delFlag;

    /**
     * 用户ids
     */
    @Excel(name = "用户ids")
    private String userIds;

    /**
     * 对方用户信息
     */
    private User user;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 最新留言内容
     */
    private LeaveWordSub latestLeaveWordSub;

    /**
     * 未读消息数量
     */
    private Long unReadMessageNum;

    public Long getUnReadMessageNum() {
        return unReadMessageNum;
    }

    public void setUnReadMessageNum(Long unReadMessageNum) {
        this.unReadMessageNum = unReadMessageNum;
    }

    public LeaveWordSub getLatestLeaveWordSub() {
        return latestLeaveWordSub;
    }

    public void setLatestLeaveWordSub(LeaveWordSub latestLeaveWordSub) {
        this.latestLeaveWordSub = latestLeaveWordSub;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setCreateDept(Long createDept) {
        this.createDept = createDept;
    }

    public Long getCreateDept() {
        return createDept;
    }

    public void setDelFlag(Long delFlag) {
        this.delFlag = delFlag;
    }

    public Long getDelFlag() {
        return delFlag;
    }

    public void setUserIds(String userIds) {
        this.userIds = userIds;
    }

    public String getUserIds() {
        return userIds;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("createDept", getCreateDept())
            .append("delFlag", getDelFlag())
            .append("userIds", getUserIds())
            .toString();
    }

    @Data
    public static class LeaveWordDetailBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -5906902184005790770L;

        /**
         * 对方用户id
         */
        private Long userId;
    }
}
