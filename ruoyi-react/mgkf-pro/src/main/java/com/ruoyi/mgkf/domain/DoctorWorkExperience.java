package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.util.List;

/**
 * 医师工作经历对象 t_doctor_work_experience
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class DoctorWorkExperience extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 医师表id */
    @Excel(name = "医师表id")
    private Long doctorId;

    /** 工作开始时间 */
    @Excel(name = "工作开始时间")
    private String startTime;

    /** 工作结束时间(null表示至今) */
    @Excel(name = "工作结束时间(null表示至今)")
    private String endTime;

    /** 职位(中文) */
    @Excel(name = "职位(中文)")
    private String positionZh;

    /** 职位(英文) */
    @Excel(name = "职位(英文)")
    private String positionEn;

    /** 职位 */
    @Excel(name = "职位")
    private String position;

    /** 工作内容(中文) */
    @Excel(name = "工作内容(中文)")
    private String contentZh;

    /** 工作内容(英文) */
    @Excel(name = "工作内容(英文)")
    private String contentEn;

    /** 工作内容 */
    @Excel(name = "工作内容")
    private String content;

    /**
     * 医师表id集合
     */
    private List<Long> doctorIdList;

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Long> getDoctorIdList() {
        return doctorIdList;
    }

    public void setDoctorIdList(List<Long> doctorIdList) {
        this.doctorIdList = doctorIdList;
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
    public void setDoctorId(Long doctorId) 
    {
        this.doctorId = doctorId;
    }

    public Long getDoctorId() 
    {
        return doctorId;
    }
    public void setStartTime(String startTime) 
    {
        this.startTime = startTime;
    }

    public String getStartTime() 
    {
        return startTime;
    }
    public void setEndTime(String endTime) 
    {
        this.endTime = endTime;
    }

    public String getEndTime() 
    {
        return endTime;
    }
    public void setPositionZh(String positionZh) 
    {
        this.positionZh = positionZh;
    }

    public String getPositionZh() 
    {
        return positionZh;
    }
    public void setPositionEn(String positionEn) 
    {
        this.positionEn = positionEn;
    }

    public String getPositionEn() 
    {
        return positionEn;
    }
    public void setContentZh(String contentZh) 
    {
        this.contentZh = contentZh;
    }

    public String getContentZh() 
    {
        return contentZh;
    }
    public void setContentEn(String contentEn) 
    {
        this.contentEn = contentEn;
    }

    public String getContentEn() 
    {
        return contentEn;
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
            .append("doctorId", getDoctorId())
            .append("startTime", getStartTime())
            .append("endTime", getEndTime())
            .append("positionZh", getPositionZh())
            .append("positionEn", getPositionEn())
            .append("contentZh", getContentZh())
            .append("contentEn", getContentEn())
            .toString();
    }
}
