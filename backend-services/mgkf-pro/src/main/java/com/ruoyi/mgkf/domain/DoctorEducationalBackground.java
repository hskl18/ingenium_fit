package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.util.List;

/**
 * 医师教育背景对象 t_doctor_educational_background
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class DoctorEducationalBackground extends BaseEntity
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

    /** 教育开始时间 */
    @Excel(name = "教育开始时间")
    private String startTime;

    /** 教育结束时间 */
    @Excel(name = "教育结束时间")
    private String endTime;

    /** 学历(中文) */
    @Excel(name = "学历(中文)")
    private String qualificationZh;

    /** 学历(英文) */
    @Excel(name = "学历(英文)")
    private String qualificationEn;

    /** 学历 */
    @Excel(name = "学历")
    private String qualification;

    /**
     * 医师表id列表
     */
    private List<Long> doctorIdList;

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
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
    public void setQualificationZh(String qualificationZh) 
    {
        this.qualificationZh = qualificationZh;
    }

    public String getQualificationZh() 
    {
        return qualificationZh;
    }
    public void setQualificationEn(String qualificationEn) 
    {
        this.qualificationEn = qualificationEn;
    }

    public String getQualificationEn() 
    {
        return qualificationEn;
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
            .append("qualificationZh", getQualificationZh())
            .append("qualificationEn", getQualificationEn())
            .toString();
    }
}
