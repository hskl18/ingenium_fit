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
 * 动态帖子对象 t_dynamics_post
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class DynamicsPost extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 动态帖子分类id */
    @Excel(name = "动态帖子分类id")
    private Long dynamicsPostCategoryId;

    /** 动态内容 */
    @Excel(name = "动态内容")
    private String content;

    /** 动态图片 */
    @Excel(name = "动态图片")
    private String pictures;

    /** 动态视频 */
    @Excel(name = "动态视频")
    private String videos;

    /** 是否公开：1-是 2-否 */
    @Excel(name = "是否公开：1-是 2-否")
    private Long whetherPublic;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 点赞数 */
    @Excel(name = "点赞数")
    private Long likesNum;

    /** 评论数 */
    @Excel(name = "评论数")
    private Long commentNum;

    /** 转发数 */
    @Excel(name = "转发数")
    private Long forwardNum;

    /** 是否推荐：1-是 2-否 */
    @Excel(name = "是否推荐：1-是 2-否")
    private Long whetherRecommend;

    /**
     *  用户信息
     */
    private User user;

    /**
     * 登录用户是否点赞该动态帖子
     */
    private Boolean whetherGiveLikeByLoginUser;

    /**
     * 登录用户是否关注该动态帖子作者
     */
    private Boolean whetherFollowByLoginUser;

    /**
     * 用户id列表
     */
    private List<Long> userIdList;

    /**
     * 可以查看私密帖子的用户id列表
     */
    private List<Long> notPublicUserIdList;

    /** 搜索关键字 */
    private String searchKey;

    /**
     * 排序方式：1-点赞数 2-分享数
     */
    private Integer sortBy;

    /**
     * 登录用户是否屏蔽该动态帖子
     */
    private Boolean whetherBlockByLoginUser;

    /**
     * 屏蔽的动态帖子id列表
     */
    private List<Long> blockDynamicsPostIdList;

    /**
     * 动态帖子分组id字符串
     */
    private String dynamicsPostIds;

    /**
     * 动态帖子列表
     */
    private List<DynamicsPost> dynamicsPostList;

    /**
     * 时区
     */
    private String timeZone;

    /**
     * 创建时间-年月
     */
    private String yearMonth;

    /**
     * 动态帖子id列表
     */
    private List<Long> dynamicsPostIdList;
    /**
     * 当前登录用户是否收藏
     */
    private Boolean whetherFavoriteByLoginUser;

    /**
     * 动态帖子分类对象
     */
    private DynamicsPostCategory dynamicsPostCategory;

    /**
     * 用户头像
     */
    private String userAvatar;

    /**
     * 用户昵称
     */
    private String userNickname;

    private Long createStartTime;

    private Long createEndTime;

    private String author;

    private Integer publishNum;

    /**
     * 来源：1-平台创建 2-用户创建
     */
    private Integer sourceType;

    public Integer getSourceType() {
        return sourceType;
    }

    public void setSourceType(Integer sourceType) {
        this.sourceType = sourceType;
    }

    public List<Long> getNotPublicUserIdList() {
        return notPublicUserIdList;
    }

    public void setNotPublicUserIdList(List<Long> notPublicUserIdList) {
        this.notPublicUserIdList = notPublicUserIdList;
    }

    public Integer getPublishNum() {
        return publishNum;
    }

    public void setPublishNum(Integer publishNum) {
        this.publishNum = publishNum;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
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

    public String getUserNickname() {
        return userNickname;
    }

    public void setUserNickname(String userNickname) {
        this.userNickname = userNickname;
    }

    public DynamicsPostCategory getDynamicsPostCategory() {
        return dynamicsPostCategory;
    }

    public void setDynamicsPostCategory(DynamicsPostCategory dynamicsPostCategory) {
        this.dynamicsPostCategory = dynamicsPostCategory;
    }

    public Boolean getWhetherFavoriteByLoginUser() {
        return whetherFavoriteByLoginUser;
    }

    public void setWhetherFavoriteByLoginUser(Boolean whetherFavoriteByLoginUser) {
        this.whetherFavoriteByLoginUser = whetherFavoriteByLoginUser;
    }

    public List<Long> getDynamicsPostIdList() {
        return dynamicsPostIdList;
    }

    public void setDynamicsPostIdList(List<Long> dynamicsPostIdList) {
        this.dynamicsPostIdList = dynamicsPostIdList;
    }

    public String getYearMonth() {
        return yearMonth;
    }

    public void setYearMonth(String yearMonth) {
        this.yearMonth = yearMonth;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public String getDynamicsPostIds() {
        return dynamicsPostIds;
    }

    public void setDynamicsPostIds(String dynamicsPostIds) {
        this.dynamicsPostIds = dynamicsPostIds;
    }

    public List<DynamicsPost> getDynamicsPostList() {
        return dynamicsPostList;
    }

    public void setDynamicsPostList(List<DynamicsPost> dynamicsPostList) {
        this.dynamicsPostList = dynamicsPostList;
    }

    public List<Long> getBlockDynamicsPostIdList() {
        return blockDynamicsPostIdList;
    }

    public void setBlockDynamicsPostIdList(List<Long> blockDynamicsPostIdList) {
        this.blockDynamicsPostIdList = blockDynamicsPostIdList;
    }

    public Boolean getWhetherBlockByLoginUser() {
        return whetherBlockByLoginUser;
    }

    public void setWhetherBlockByLoginUser(Boolean whetherBlockByLoginUser) {
        this.whetherBlockByLoginUser = whetherBlockByLoginUser;
    }

    public Integer getSortBy() {
        return sortBy;
    }

    public void setSortBy(Integer sortBy) {
        this.sortBy = sortBy;
    }

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }

    public List<Long> getUserIdList() {
        return userIdList;
    }

    public void setUserIdList(List<Long> userIdList) {
        this.userIdList = userIdList;
    }

    public Boolean getWhetherFollowByLoginUser() {
        return whetherFollowByLoginUser;
    }

    public void setWhetherFollowByLoginUser(Boolean whetherFollowByLoginUser) {
        this.whetherFollowByLoginUser = whetherFollowByLoginUser;
    }

    public Boolean getWhetherGiveLikeByLoginUser() {
        return whetherGiveLikeByLoginUser;
    }

    public void setWhetherGiveLikeByLoginUser(Boolean whetherGiveLikeByLoginUser) {
        this.whetherGiveLikeByLoginUser = whetherGiveLikeByLoginUser;
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
    public void setDynamicsPostCategoryId(Long dynamicsPostCategoryId) 
    {
        this.dynamicsPostCategoryId = dynamicsPostCategoryId;
    }

    public Long getDynamicsPostCategoryId() 
    {
        return dynamicsPostCategoryId;
    }
    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
    }
    public void setPictures(String pictures) 
    {
        this.pictures = pictures;
    }

    public String getPictures() 
    {
        return pictures;
    }
    public void setVideos(String videos) 
    {
        this.videos = videos;
    }

    public String getVideos() 
    {
        return videos;
    }
    public void setWhetherPublic(Long whetherPublic) 
    {
        this.whetherPublic = whetherPublic;
    }

    public Long getWhetherPublic() 
    {
        return whetherPublic;
    }
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
    }
    public void setLikesNum(Long likesNum) 
    {
        this.likesNum = likesNum;
    }

    public Long getLikesNum() 
    {
        return likesNum;
    }
    public void setCommentNum(Long commentNum) 
    {
        this.commentNum = commentNum;
    }

    public Long getCommentNum() 
    {
        return commentNum;
    }
    public void setForwardNum(Long forwardNum) 
    {
        this.forwardNum = forwardNum;
    }

    public Long getForwardNum() 
    {
        return forwardNum;
    }
    public void setWhetherRecommend(Long whetherRecommend) 
    {
        this.whetherRecommend = whetherRecommend;
    }

    public Long getWhetherRecommend() 
    {
        return whetherRecommend;
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
            .append("dynamicsPostCategoryId", getDynamicsPostCategoryId())
            .append("content", getContent())
            .append("pictures", getPictures())
            .append("videos", getVideos())
            .append("whetherPublic", getWhetherPublic())
            .append("userId", getUserId())
            .append("likesNum", getLikesNum())
            .append("commentNum", getCommentNum())
            .append("forwardNum", getForwardNum())
            .append("whetherRecommend", getWhetherRecommend())
            .toString();
    }

    @Data
    public static class DynamicsPostListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 6323495404786574661L;

        /** 是否推荐：1-是 2-否, 不传查全部 */
        private Long whetherRecommend;

        /**
         * 查询类型：1-Friend Updates朋友动态  2-Recently最近的
         */
        private Integer selectType;

        /** 动态帖子分类id */
        private Long dynamicsPostCategoryId;

        /** 搜索关键字 */
        private String searchKey;

        /**
         * 排序方式：1-点赞数 2-分享数
         */
        private Integer sortBy;
    }

    @Data
    public static class DynamicsPostBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 2764636592044601958L;

        /** 动态帖子分类id */
        private Long dynamicsPostCategoryId;

        /** 动态内容 */
        private String content;

        /** 动态图片 */
        private String pictures;

        /** 动态视频 */
        private String videos;

        /** 是否公开：1-是 2-否 */
        private Long whetherPublic;
    }
}
