package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 系统消息对象 t_system_message
 * 
 * @author ruoyi
 * @date 2025-08-22
 */
public class SystemMessage extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 消息标题 */
    @Excel(name = "消息标题")
    private String titleZh;

    /** 消息标题 */
    @Excel(name = "消息标题")
    private String titleEn;

    /** 消息简述 */
    @Excel(name = "消息简述")
    private String sketchZh;

    /** 消息简述 */
    @Excel(name = "消息简述")
    private String sketchEn;

    /** 消息内容 */
    @Excel(name = "消息内容")
    private String contentZh;

    /** 消息内容 */
    @Excel(name = "消息内容")
    private String contentEn;

    /** 是否发布：1-是 2-否 */
    @Excel(name = "是否发布：1-是 2-否")
    private Long isPublish;

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
    public void setTitleZh(String titleZh) 
    {
        this.titleZh = titleZh;
    }

    public String getTitleZh() 
    {
        return titleZh;
    }
    public void setTitleEn(String titleEn) 
    {
        this.titleEn = titleEn;
    }

    public String getTitleEn() 
    {
        return titleEn;
    }
    public void setSketchZh(String sketchZh) 
    {
        this.sketchZh = sketchZh;
    }

    public String getSketchZh() 
    {
        return sketchZh;
    }
    public void setSketchEn(String sketchEn) 
    {
        this.sketchEn = sketchEn;
    }

    public String getSketchEn() 
    {
        return sketchEn;
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
    public void setIsPublish(Long isPublish) 
    {
        this.isPublish = isPublish;
    }

    public Long getIsPublish() 
    {
        return isPublish;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("id", getId())
            .append("delFlag", getDelFlag())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("createDept", getCreateDept())
            .append("titleZh", getTitleZh())
            .append("titleEn", getTitleEn())
            .append("sketchZh", getSketchZh())
            .append("sketchEn", getSketchEn())
            .append("contentZh", getContentZh())
            .append("contentEn", getContentEn())
            .append("isPublish", getIsPublish())
            .toString();
    }
}
