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
 * 科普对象 t_science
 *
 * @author ruoyi
 * @date 2025-08-15
 */
public class Science extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /**
     * 主键ID
     */
    private Long id;

    /**
     * 1-正常 2-删除 3-禁用
     */
    private Long delFlag;

    /**
     * 创建部门
     */
    @Excel(name = "创建部门")
    private Long createDept;

    /**
     * 科普分类id
     */
    @Excel(name = "科普分类id")
    private Long scienceCategoryId;

    /**
     * 封面图片
     */
    @Excel(name = "封面图片")
    private String coverImage;

    /**
     * 封面视频
     */
    @Excel(name = "封面视频")
    private String coverVideo;

    /**
     * 详情图片
     */
    @Excel(name = "详情图片")
    private String detailImages;

    /**
     * 详情视频
     */
    @Excel(name = "详情视频")
    private String detailVideos;

    /**
     * 标题(中文)
     */
    @Excel(name = "标题(中文)")
    private String titleZh;

    /**
     * 标题(英文)
     */
    @Excel(name = "标题(英文)")
    private String titleEn;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容(中文)
     */
    @Excel(name = "内容(中文)")
    private String contentZh;

    /**
     * 内容(英文)
     */
    @Excel(name = "内容(英文)")
    private String contentEn;

    /**
     * 内容
     */
    private String content;

    /**
     * 是否推荐：1-是 2-否
     */
    @Excel(name = "是否推荐：1-是 2-否")
    private Long whetherRecommend;

    /**
     * 评论数
     */
    private Integer commentNum;

    /** 搜索关键字 */
    private String searchKey;

    /**
     * 当前登录用户是否收藏
     */
    private Boolean whetherFavoriteByLoginUser;

    /**
     * 科普ID列表
     */
    private List<Long> scienceIdList;

    /**
     * 科普分类对象
     */
    private ScienceCategory scienceCategory;

    private Long createStartTime;

    private Long createEndTime;

    public Integer getCommentNum() {
        return commentNum;
    }

    public void setCommentNum(Integer commentNum) {
        this.commentNum = commentNum;
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

    public ScienceCategory getScienceCategory() {
        return scienceCategory;
    }

    public void setScienceCategory(ScienceCategory scienceCategory) {
        this.scienceCategory = scienceCategory;
    }

    public List<Long> getScienceIdList() {
        return scienceIdList;
    }

    public void setScienceIdList(List<Long> scienceIdList) {
        this.scienceIdList = scienceIdList;
    }

    public Boolean getWhetherFavoriteByLoginUser() {
        return whetherFavoriteByLoginUser;
    }

    public void setWhetherFavoriteByLoginUser(Boolean whetherFavoriteByLoginUser) {
        this.whetherFavoriteByLoginUser = whetherFavoriteByLoginUser;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setDelFlag(Long delFlag) {
        this.delFlag = delFlag;
    }

    public Long getDelFlag() {
        return delFlag;
    }

    public void setCreateDept(Long createDept) {
        this.createDept = createDept;
    }

    public Long getCreateDept() {
        return createDept;
    }

    public void setScienceCategoryId(Long scienceCategoryId) {
        this.scienceCategoryId = scienceCategoryId;
    }

    public Long getScienceCategoryId() {
        return scienceCategoryId;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverVideo(String coverVideo) {
        this.coverVideo = coverVideo;
    }

    public String getCoverVideo() {
        return coverVideo;
    }

    public void setDetailImages(String detailImages) {
        this.detailImages = detailImages;
    }

    public String getDetailImages() {
        return detailImages;
    }

    public void setDetailVideos(String detailVideos) {
        this.detailVideos = detailVideos;
    }

    public String getDetailVideos() {
        return detailVideos;
    }

    public void setTitleZh(String titleZh) {
        this.titleZh = titleZh;
    }

    public String getTitleZh() {
        return titleZh;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setContentZh(String contentZh) {
        this.contentZh = contentZh;
    }

    public String getContentZh() {
        return contentZh;
    }

    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
    }

    public String getContentEn() {
        return contentEn;
    }

    public void setWhetherRecommend(Long whetherRecommend) {
        this.whetherRecommend = whetherRecommend;
    }

    public Long getWhetherRecommend() {
        return whetherRecommend;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("delFlag", getDelFlag())
            .append("createDept", getCreateDept())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("scienceCategoryId", getScienceCategoryId())
            .append("coverImage", getCoverImage())
            .append("coverVideo", getCoverVideo())
            .append("detailImages", getDetailImages())
            .append("detailVideos", getDetailVideos())
            .append("titleZh", getTitleZh())
            .append("titleEn", getTitleEn())
            .append("contentZh", getContentZh())
            .append("contentEn", getContentEn())
            .append("whetherRecommend", getWhetherRecommend())
            .toString();
    }

    @Data
    public static class ScienceListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 268178042867881218L;

        /**
         * 是否推荐：1-是 2-否
         */
        private Long whetherRecommend;

        /**
         * 科普分类id
         */
        private Long scienceCategoryId;

        /** 搜索关键字 */
        private String searchKey;
    }
}
