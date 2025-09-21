package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.util.List;

/**
 * 科普分类对象 t_science_category
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class ScienceCategory extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 分类名称(中) */
    @Excel(name = "分类名称(中)")
    private String nameZh;

    /** 分类名称(英) */
    @Excel(name = "分类名称(英)")
    private String nameEn;

    /** 分类名称 */
    private String name;

    /** 分类图标 */
    @Excel(name = "分类图标")
    private String icon;

    /** 排序 */
    @Excel(name = "排序")
    private Long sort;

    /**
     * 科普分类id列表
     */
    private List<Long> scienceCategoryIdList;

    public List<Long> getScienceCategoryIdList() {
        return scienceCategoryIdList;
    }

    public void setScienceCategoryIdList(List<Long> scienceCategoryIdList) {
        this.scienceCategoryIdList = scienceCategoryIdList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
    public void setIcon(String icon) 
    {
        this.icon = icon;
    }

    public String getIcon() 
    {
        return icon;
    }
    public void setSort(Long sort) 
    {
        this.sort = sort;
    }

    public Long getSort() 
    {
        return sort;
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
            .append("nameZh", getNameZh())
            .append("nameEn", getNameEn())
            .append("icon", getIcon())
            .append("sort", getSort())
            .toString();
    }
}
