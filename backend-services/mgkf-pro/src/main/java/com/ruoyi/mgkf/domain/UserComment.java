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
 * 用户评论对象 t_user_comment
 *
 * @author ruoyi
 * @date 2025-08-15
 */
public class UserComment extends BaseEntity {
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
     * 用户id
     */
    @Excel(name = "用户id")
    private Long userId;

    /**
     * 内容
     */
    @Excel(name = "内容")
    private String content;

    /**
     * 图片
     */
    @Excel(name = "图片")
    private String images;

    /**
     * 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
     */
    @Excel(name = "评论对象：1-动态帖子 2-科普 3-康复中心 4-医师")
    private Long objectType;

    /**
     * 评论对象id
     */
    @Excel(name = "评论对象id")
    private Long objectId;

    /**
     * 星级
     */
    @Excel(name = "星级")
    private Double star;

    /**
     * 用户信息
     */
    private User user;

    /**
     * 评论回复列表
     */
    private List<UserCommentReply> userCommentReplyList;

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

    /**
     * 医生对象
     */
    private Doctor doctor;

    /**
     * 用户头像
     */
    private String userAvatar;

    /**
     * 用户昵称
     */
    private String userNickname;

    /**
     * 用户评论id列表
     */
    private List<Long> userCommentIdList;


    public List<Long> getUserCommentIdList() {
        return userCommentIdList;
    }

    public void setUserCommentIdList(List<Long> userCommentIdList) {
        this.userCommentIdList = userCommentIdList;
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

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
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

    public List<UserCommentReply> getUserCommentReplyList() {
        return userCommentReplyList;
    }

    public void setUserCommentReplyList(List<UserCommentReply> userCommentReplyList) {
        this.userCommentReplyList = userCommentReplyList;
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

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setImages(String images) {
        this.images = images;
    }

    public String getImages() {
        return images;
    }

    public void setObjectType(Long objectType) {
        this.objectType = objectType;
    }

    public Long getObjectType() {
        return objectType;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setStar(Double star) {
        this.star = star;
    }

    public Double getStar() {
        return star;
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
            .append("userId", getUserId())
            .append("content", getContent())
            .append("images", getImages())
            .append("objectType", getObjectType())
            .append("objectId", getObjectId())
            .append("star", getStar())
            .toString();
    }

    @Data
    public static class UserCommentBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -2755812398087360502L;

        /**
         * 内容
         */
        private String content;

        /**
         * 图片
         */
        private String images;

        /**
         * 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
         */
        private Long objectType;

        /**
         * 评论对象id
         */
        private Long objectId;

        /**
         * 星级
         */
        private Double star;
    }

    @Data
    public static class UserCommentListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -3723950708568131352L;

        /**
         * 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
         */
        private Long objectType;

        /**
         * 评论对象id
         */
        private Long objectId;
    }
}
