package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 热门搜索词对象 t_popular_search_terms
 * 
 * @author ruoyi
 * @date 2025-08-20
 */
public class PopularSearchTerms extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 租户号 */
    private Long id;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 删除标识 1 正常 2 删除 3 禁用 */
    private Long delFlag;

    /** 热门搜索词(中) */
    @Excel(name = "热门搜索词(中)")
    private String searchTermsZh;

    /** 热门搜索词(英) */
    @Excel(name = "热门搜索词(英)")
    private String searchTermsEn;

    /** 热门搜索词 */
    @Excel(name = "热门搜索词")
    private String searchTerms;

    /** 排序 */
    @Excel(name = "排序")
    private Long sort;

    public String getSearchTerms() {
        return searchTerms;
    }

    public void setSearchTerms(String searchTerms) {
        this.searchTerms = searchTerms;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getId() 
    {
        return id;
    }
    public void setCreateDept(Long createDept) 
    {
        this.createDept = createDept;
    }

    public Long getCreateDept() 
    {
        return createDept;
    }
    public void setDelFlag(Long delFlag) 
    {
        this.delFlag = delFlag;
    }

    public Long getDelFlag() 
    {
        return delFlag;
    }
    public void setSearchTermsZh(String searchTermsZh) 
    {
        this.searchTermsZh = searchTermsZh;
    }

    public String getSearchTermsZh() 
    {
        return searchTermsZh;
    }
    public void setSearchTermsEn(String searchTermsEn) 
    {
        this.searchTermsEn = searchTermsEn;
    }

    public String getSearchTermsEn() 
    {
        return searchTermsEn;
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
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("createDept", getCreateDept())
            .append("delFlag", getDelFlag())
            .append("searchTermsZh", getSearchTermsZh())
            .append("searchTermsEn", getSearchTermsEn())
            .append("sort", getSort())
            .toString();
    }
}
