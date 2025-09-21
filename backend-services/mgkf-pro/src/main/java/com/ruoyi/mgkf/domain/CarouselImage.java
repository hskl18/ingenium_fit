package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 轮播图对象 t_carousel_image
 * 
 * @author ruoyi
 * @date 2025-08-16
 */
public class CarouselImage extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 图片 */
    @Excel(name = "图片")
    private String image;

    /** 排序 */
    @Excel(name = "排序")
    private Long sort;

    /** 类型：1-图文介绍 2-科普文章 3-动态 4-个人中心页面 */
    @Excel(name = "类型：1-图文介绍 2-科普文章 3-动态 4-个人中心页面")
    private Long type;

    /** 对象id */
    @Excel(name = "对象id")
    private Long objectId;

    /** 图文介绍内容(中) */
    @Excel(name = "图文介绍内容(中)")
    private String contentZh;

    /** 图文介绍内容(英) */
    @Excel(name = "图文介绍内容(英)")
    private String contentEn;

    /** 图文介绍内容 */
    @Excel(name = "图文介绍内容")
    private String content;

    /**
     * 科普文章对象
     */
    private Science science;

    /**
     * 动态帖子对象
     */
    private DynamicsPost dynamicsPost;

    public Science getScience() {
        return science;
    }

    public void setScience(Science science) {
        this.science = science;
    }

    public DynamicsPost getDynamicsPost() {
        return dynamicsPost;
    }

    public void setDynamicsPost(DynamicsPost dynamicsPost) {
        this.dynamicsPost = dynamicsPost;
    }

    public String getContentZh() {
        return contentZh;
    }

    public void setContentZh(String contentZh) {
        this.contentZh = contentZh;
    }

    public String getContentEn() {
        return contentEn;
    }

    public void setContentEn(String contentEn) {
        this.contentEn = contentEn;
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
    public void setImage(String image) 
    {
        this.image = image;
    }

    public String getImage() 
    {
        return image;
    }
    public void setSort(Long sort) 
    {
        this.sort = sort;
    }

    public Long getSort() 
    {
        return sort;
    }
    public void setType(Long type) 
    {
        this.type = type;
    }

    public Long getType() 
    {
        return type;
    }
    public void setObjectId(Long objectId) 
    {
        this.objectId = objectId;
    }

    public Long getObjectId() 
    {
        return objectId;
    }
    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
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
            .append("image", getImage())
            .append("sort", getSort())
            .append("type", getType())
            .append("objectId", getObjectId())
            .append("content", getContent())
            .toString();
    }
}
