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
 * 收藏对象 t_favorite
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class Favorite extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 收藏对象id */
    @Excel(name = "收藏对象id")
    private Long objectId;

    /** 收藏对象类型：1-康复中心 2-科普 3-动态 */
    @Excel(name = "收藏对象类型：1-康复中心 2-科普 3-动态")
    private Long objectType;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 收藏对象id集合 */
    private List<Long> objectIdList;

    /** 经度 */
    private String longitude;

    /** 纬度 */
    private String latitude;

    /**
     * 康复中心对象
     */
    private RehabilitationCenter rehabilitationCenter;

    /**
     * 动态帖子对象
     */
    private DynamicsPost dynamicsPost;

    /**
     * 科普对象
     */
    private Science science;

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

    public RehabilitationCenter getRehabilitationCenter() {
        return rehabilitationCenter;
    }

    public void setRehabilitationCenter(RehabilitationCenter rehabilitationCenter) {
        this.rehabilitationCenter = rehabilitationCenter;
    }

    public DynamicsPost getDynamicsPost() {
        return dynamicsPost;
    }

    public void setDynamicsPost(DynamicsPost dynamicsPost) {
        this.dynamicsPost = dynamicsPost;
    }

    public Science getScience() {
        return science;
    }

    public void setScience(Science science) {
        this.science = science;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public List<Long> getObjectIdList() {
        return objectIdList;
    }

    public void setObjectIdList(List<Long> objectIdList) {
        this.objectIdList = objectIdList;
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
    public void setObjectId(Long objectId) 
    {
        this.objectId = objectId;
    }

    public Long getObjectId() 
    {
        return objectId;
    }
    public void setObjectType(Long objectType) 
    {
        this.objectType = objectType;
    }

    public Long getObjectType() 
    {
        return objectType;
    }
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
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
            .append("objectId", getObjectId())
            .append("objectType", getObjectType())
            .append("userId", getUserId())
            .toString();
    }

    @Data
    public static class FavoriteBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 6017187028072723828L;

        /** 收藏对象id */
        private Long objectId;

        /** 收藏对象类型：1-康复中心 2-科普 3-动态 */
        private Long objectType;
    }

    @Data
    public static class FavoriteListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 3614745128486671787L;

        /** 收藏对象类型：1-康复中心 2-科普 3-动态 */
        private Long objectType;

        /** 经度 */
        private String longitude;

        /** 纬度 */
        private String latitude;
    }
}
