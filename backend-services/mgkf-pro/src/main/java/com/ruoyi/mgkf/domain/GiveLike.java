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
 * 点赞对象 t_give_like
 *
 * @author ruoyi
 * @date 2025-08-15
 */
public class GiveLike extends BaseEntity {
    private static final long serialVersionUID = 1324791299103678127L;

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
     * 用户id
     */
    @Excel(name = "用户id")
    private Long userId;

    /**
     * 点赞对象id
     */
    @Excel(name = "点赞对象id")
    private Long objectId;

    /**
     * 点赞类型：1-点赞帖子
     */
    @Excel(name = "点赞类型：1-点赞帖子")
    private Long objectType;

    private Long createStartTime;

    private Long createEndTime;

    private Integer giveLikeNum;

    public Integer getGiveLikeNum() {
        return giveLikeNum;
    }

    public void setGiveLikeNum(Integer giveLikeNum) {
        this.giveLikeNum = giveLikeNum;
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

    private List<Long> objectIdList;

    public List<Long> getObjectIdList() {
        return objectIdList;
    }

    public void setObjectIdList(List<Long> objectIdList) {
        this.objectIdList = objectIdList;
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

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectType(Long objectType) {
        this.objectType = objectType;
    }

    public Long getObjectType() {
        return objectType;
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
            .append("userId", getUserId())
            .append("objectId", getObjectId())
            .append("objectType", getObjectType())
            .toString();
    }

    @Data
    public static class GiveLikeBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -5872578460923699093L;

        /**
         * 点赞对象id
         */
        private Long objectId;

        /**
         * 点赞类型：1-点赞帖子
         */
        private Long objectType;
    }
}
