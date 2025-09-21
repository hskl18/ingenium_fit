package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 协议对象 t_agreement
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class Agreement extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** $column.columnComment */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 标题(中) */
    @Excel(name = "标题(中)")
    private String titleZh;

    /** 标题(英) */
    @Excel(name = "标题(英)")
    private String titleEn;

    /** 标题 */
    private String title;

    /** 内容(中) */
    @Excel(name = "内容(中)")
    private String contentZh;

    /** 内容(英) */
    @Excel(name = "内容(英)")
    private String contentEn;

    /** 内容 */
    @Excel(name = "内容")
    private String content;

    /** 协议编码 */
    @Excel(name = "协议编码")
    private String code;

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
    public void setCode(String code) 
    {
        this.code = code;
    }

    public String getCode() 
    {
        return code;
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
            .append("titleZh", getTitleZh())
            .append("titleEn", getTitleEn())
            .append("contentZh", getContentZh())
            .append("contentEn", getContentEn())
            .append("code", getCode())
            .toString();
    }
}
