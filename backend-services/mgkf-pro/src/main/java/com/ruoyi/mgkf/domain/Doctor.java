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
 * 医师对象 t_doctor
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class Doctor extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 康复中心表id */
    @Excel(name = "康复中心表id")
    private Long rehabilitationCenterId;

    /** 头像 */
    @Excel(name = "头像")
    private String headImage;

    /** 背景图片 */
    @Excel(name = "背景图片")
    private String backgroundImages;

    /** 医师名称(中文) */
    @Excel(name = "医师名称(中文)")
    private String nameZh;

    /** 医师名称(英文) */
    @Excel(name = "医师名称(英文)")
    private String nameEn;

    /** 医师名称 */
    @Excel(name = "医师名称")
    private String name;

    /** 标签(中文) */
    @Excel(name = "标签(中文)")
    private String tagsZh;

    /** 标签(英文) */
    @Excel(name = "标签(英文)")
    private String tagsEn;

    /** 标签 */
    @Excel(name = "标签")
    private String tags;

    /** 职称(中文) */
    @Excel(name = "职称(中文)")
    private String positionTitleZh;

    /** 职称(英文) */
    @Excel(name = "职称(英文)")
    private String positionTitleEn;

    /** 职称 */
    @Excel(name = "职称")
    private String positionTitle;

    /** 职业范围(中文) */
    @Excel(name = "职业范围(中文)")
    private String positionRangeZh;

    /** 职业范围(英文) */
    @Excel(name = "职业范围(英文)")
    private String positionRangeEn;

    /** 职业范围 */
    @Excel(name = "职业范围")
    private String positionRange;

    /** 星级 */
    @Excel(name = "星级")
    private Double star;

    /** 评论数 */
    @Excel(name = "评论数")
    private Long commentNum;

    /** 医师学历背景列表 */
    private List<DoctorEducationalBackground> doctorEducationalBackgroundList;

    /** 医师工作经历列表 */
    private List<DoctorWorkExperience> doctorWorkExperienceList;

    /**
     * 康复中心对象
     */
    private RehabilitationCenter rehabilitationCenter;

    /**
     * 医师id列表
     */
    private List<Long> doctorIdList;

    public List<Long> getDoctorIdList() {
        return doctorIdList;
    }

    public void setDoctorIdList(List<Long> doctorIdList) {
        this.doctorIdList = doctorIdList;
    }

    public RehabilitationCenter getRehabilitationCenter() {
        return rehabilitationCenter;
    }

    public void setRehabilitationCenter(RehabilitationCenter rehabilitationCenter) {
        this.rehabilitationCenter = rehabilitationCenter;
    }

    public List<DoctorEducationalBackground> getDoctorEducationalBackgroundList() {
        return doctorEducationalBackgroundList;
    }

    public void setDoctorEducationalBackgroundList(List<DoctorEducationalBackground> doctorEducationalBackgroundList) {
        this.doctorEducationalBackgroundList = doctorEducationalBackgroundList;
    }

    public List<DoctorWorkExperience> getDoctorWorkExperienceList() {
        return doctorWorkExperienceList;
    }

    public void setDoctorWorkExperienceList(List<DoctorWorkExperience> doctorWorkExperienceList) {
        this.doctorWorkExperienceList = doctorWorkExperienceList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getPositionTitle() {
        return positionTitle;
    }

    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
    }

    public String getPositionRange() {
        return positionRange;
    }

    public void setPositionRange(String positionRange) {
        this.positionRange = positionRange;
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
    public void setRehabilitationCenterId(Long rehabilitationCenterId) 
    {
        this.rehabilitationCenterId = rehabilitationCenterId;
    }

    public Long getRehabilitationCenterId() 
    {
        return rehabilitationCenterId;
    }
    public void setHeadImage(String headImage) 
    {
        this.headImage = headImage;
    }

    public String getHeadImage() 
    {
        return headImage;
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
    public void setTagsZh(String tagsZh) 
    {
        this.tagsZh = tagsZh;
    }

    public String getTagsZh() 
    {
        return tagsZh;
    }
    public void setTagsEn(String tagsEn) 
    {
        this.tagsEn = tagsEn;
    }

    public String getTagsEn() 
    {
        return tagsEn;
    }
    public void setPositionTitleZh(String positionTitleZh) 
    {
        this.positionTitleZh = positionTitleZh;
    }

    public String getPositionTitleZh() 
    {
        return positionTitleZh;
    }
    public void setPositionTitleEn(String positionTitleEn) 
    {
        this.positionTitleEn = positionTitleEn;
    }

    public String getPositionTitleEn() 
    {
        return positionTitleEn;
    }
    public void setPositionRangeZh(String positionRangeZh) 
    {
        this.positionRangeZh = positionRangeZh;
    }

    public String getPositionRangeZh() 
    {
        return positionRangeZh;
    }
    public void setPositionRangeEn(String positionRangeEn) 
    {
        this.positionRangeEn = positionRangeEn;
    }

    public String getPositionRangeEn() 
    {
        return positionRangeEn;
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
            .append("rehabilitationCenterId", getRehabilitationCenterId())
            .append("headImage", getHeadImage())
            .append("backgroundImages", getBackgroundImages())
            .append("nameZh", getNameZh())
            .append("nameEn", getNameEn())
            .append("tagsZh", getTagsZh())
            .append("tagsEn", getTagsEn())
            .append("positionTitleZh", getPositionTitleZh())
            .append("positionTitleEn", getPositionTitleEn())
            .append("positionRangeZh", getPositionRangeZh())
            .append("positionRangeEn", getPositionRangeEn())
            .append("star", getStar())
            .append("commentNum", getCommentNum())
            .toString();
    }

    @Data
    public static class DoctorListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = 1430533032822648470L;

        /** 康复中心表id */
        private Long rehabilitationCenterId;
    }
}
