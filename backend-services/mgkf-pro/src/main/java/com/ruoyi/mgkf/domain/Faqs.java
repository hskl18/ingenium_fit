package com.ruoyi.mgkf.domain;

import lombok.Data;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.io.Serial;
import java.io.Serializable;

/**
 * 常见问题对象 t_faqs
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class Faqs extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 标题(中文) */
    @Excel(name = "标题(中文)")
    private String titleZh;

    /** 标题(英文) */
    @Excel(name = "标题(英文)")
    private String titleEn;

    /** 标题 */
    @Excel(name = "标题")
    private String title;

    /** 内容(中文) */
    @Excel(name = "内容(中文)")
    private String contentZh;

    /** 内容(英文) */
    @Excel(name = "内容(英文)")
    private String contentEn;

    /** 内容 */
    @Excel(name = "内容")
    private String content;

    /** 排序 */
    @Excel(name = "排序")
    private Long sort;

    /** 图片 */
    private String images;

    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
    }

    /**
     * 搜索关键字
     */
    private String searchKey;

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

    public String getSearchKey() {
        return searchKey;
    }

    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
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
            .append("titleZh", getTitleZh())
            .append("titleEn", getTitleEn())
            .append("contentZh", getContentZh())
            .append("contentEn", getContentEn())
            .append("sort", getSort())
            .toString();
    }

    @Data
    public static class FaqsListBo implements Serializable {

        @Serial
        private static final long serialVersionUID = -6194205440695225010L;

        /**
         * 搜索关键字
         */
        private String searchKey;
    }
}
