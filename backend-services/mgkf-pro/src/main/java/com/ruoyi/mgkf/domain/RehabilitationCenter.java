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
 * 康复中心对象 t_rehabilitation_center
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class RehabilitationCenter extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 封面图片 */
    @Excel(name = "封面图片")
    private String coverImage;

    /** 背景图片 */
    @Excel(name = "背景图片")
    private String backgroundImages;

    /** 康复中心名称(中文) */
    @Excel(name = "康复中心名称(中文)")
    private String nameZh;

    /** 康复中心名称(英文) */
    @Excel(name = "康复中心名称(英文)")
    private String nameEn;

    /** 康复中心名称 */
    @Excel(name = "康复中心名称")
    private String name;

    /** 经度 */
    @Excel(name = "经度")
    private String longitude;

    /** 纬度 */
    @Excel(name = "纬度")
    private String latitude;

    /** 地址 */
    @Excel(name = "地址")
    private String address;

    /** 详情介绍(中文) */
    @Excel(name = "详情介绍(中文)")
    private String detailZh;

    /** 详情介绍(英文) */
    @Excel(name = "详情介绍(英文)")
    private String detailEn;

    /** 详情介绍 */
    @Excel(name = "详情介绍")
    private String detail;

    /** 星级 */
    @Excel(name = "星级")
    private Double star;

    /** 评论数 */
    @Excel(name = "评论数")
    private Long commentNum;

    /**
     * 排序方式：1-默认排序 2-距离排序 3-星级排序
     */
    private Integer orderByType;

    /** 客户端经度 */
    private String clientLongitude;

    /** 客户端纬度 */
    private String clientLatitude;

    /** 距离 */
    private String distance;

    /**
     * 当前登录用户是否收藏该康复中心
     */
    private Boolean whetherFavoriteByLoginUser;

    /** 搜索关键字 */
    private String searchKey;

    /**
     * 最小评分
     */
    private Double minScore;

    /**
     * 最大评分
     */
    private Double maxScore;

    /**
     * 最小距离
     */
    private Double minDistance;

    /**
     * 最大距离
     */
    private Double maxDistance;

    /**
     * 康复中心ID列表
     */
    private List<Long> rehabilitationCenterIdList;

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

    public List<Long> getRehabilitationCenterIdList() {
        return rehabilitationCenterIdList;
    }

    public void setRehabilitationCenterIdList(List<Long> rehabilitationCenterIdList) {
        this.rehabilitationCenterIdList = rehabilitationCenterIdList;
    }

    public Double getMinScore() {
        return minScore;
    }

    public void setMinScore(Double minScore) {
        this.minScore = minScore;
    }

    public Double getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Double maxScore) {
        this.maxScore = maxScore;
    }

    public Double getMinDistance() {
        return minDistance;
    }

    public void setMinDistance(Double minDistance) {
        this.minDistance = minDistance;
    }

    public Double getMaxDistance() {
        return maxDistance;
    }

    public void setMaxDistance(Double maxDistance) {
        this.maxDistance = maxDistance;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public Boolean getWhetherFavoriteByLoginUser() {
        return whetherFavoriteByLoginUser;
    }

    public void setWhetherFavoriteByLoginUser(Boolean whetherFavoriteByLoginUser) {
        this.whetherFavoriteByLoginUser = whetherFavoriteByLoginUser;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getClientLongitude() {
        return clientLongitude;
    }

    public void setClientLongitude(String clientLongitude) {
        this.clientLongitude = clientLongitude;
    }

    public String getClientLatitude() {
        return clientLatitude;
    }

    public void setClientLatitude(String clientLatitude) {
        this.clientLatitude = clientLatitude;
    }

    public Integer getOrderByType() {
        return orderByType;
    }

    public void setOrderByType(Integer orderByType) {
        this.orderByType = orderByType;
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
    public void setCoverImage(String coverImage) 
    {
        this.coverImage = coverImage;
    }

    public String getCoverImage() 
    {
        return coverImage;
    }
    public void setBackgroundImages(String backgroundImages) 
    {
        this.backgroundImages = backgroundImages;
    }

    public String getBackgroundImages() 
    {
        return backgroundImages;
    }
    public void setNameZh(String nameZh) 
    {
        this.nameZh = nameZh;
    }

    public String getNameZh() 
    {
        return nameZh;
    }
    public void setNameEn(String nameEn) 
    {
        this.nameEn = nameEn;
    }

    public String getNameEn() 
    {
        return nameEn;
    }
    public void setLongitude(String longitude) 
    {
        this.longitude = longitude;
    }

    public String getLongitude() 
    {
        return longitude;
    }
    public void setLatitude(String latitude) 
    {
        this.latitude = latitude;
    }

    public String getLatitude() 
    {
        return latitude;
    }
    public void setAddress(String address) 
    {
        this.address = address;
    }

    public String getAddress() 
    {
        return address;
    }
    public void setDetailZh(String detailZh) 
    {
        this.detailZh = detailZh;
    }

    public String getDetailZh() 
    {
        return detailZh;
    }
    public void setDetailEn(String detailEn) 
    {
        this.detailEn = detailEn;
    }

    public String getDetailEn() 
    {
        return detailEn;
    }
    public void setStar(Double star)
    {
        this.star = star;
    }

    public Double getStar()
    {
        return star;
    }
    public void setCommentNum(Long commentNum) 
    {
        this.commentNum = commentNum;
    }

    public Long getCommentNum() 
    {
        return commentNum;
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
            .append("coverImage", getCoverImage())
            .append("backgroundImages", getBackgroundImages())
            .append("nameZh", getNameZh())
            .append("nameEn", getNameEn())
            .append("longitude", getLongitude())
            .append("latitude", getLatitude())
            .append("address", getAddress())
            .append("detailZh", getDetailZh())
            .append("detailEn", getDetailEn())
            .append("star", getStar())
            .append("commentNum", getCommentNum())
            .toString();
    }

    @Data
    public static class RehabilitationCenterListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 9220843382466415408L;

        /**
         * 排序方式：1-默认排序(默认) 2-距离排序 3-星级排序
         */
        private Integer orderByType = 1;

        /** 经度 */
        private String longitude;

        /** 纬度 */
        private String latitude;

        /** 搜索关键字 */
        private String searchKey;

        /**
         * 最小评分
         */
        private Double minScore;

        /**
         * 最大评分
         */
        private Double maxScore;

        /**
         * 最小距离
         */
        private Double minDistance;

        /**
         * 最大距离
         */
        private Double maxDistance;
    }

    @Data
    public static class RehabilitationCenterDetailBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 2506122797826194921L;

        /**
         * 康复中心 id
         */
        private Long id;

        /** 经度 */
        private String longitude;

        /** 纬度 */
        private String latitude;
    }
}
