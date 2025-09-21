package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 用户消息对象 t_user_message
 * 
 * @author ruoyi
 * @date 2025-08-22
 */
public class UserMessage extends BaseEntity
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

    /** 消息 */
    @Excel(name = "消息")
    private String title;

    /** 消息简述 */
    @Excel(name = "消息简述")
    private String sketchZh;

    /** 消息简述 */
    @Excel(name = "消息简述")
    private String sketchEn;

    /** 消息 */
    @Excel(name = "消息")
    private String sketch;

    /** 消息内容 */
    @Excel(name = "消息内容")
    private String contentZh;

    /** 消息内容 */
    @Excel(name = "消息内容")
    private String contentEn;

    /** 消息内容 */
    @Excel(name = "消息内容")
    private String content;

    /** 消息类型：1-系统消息 */
    @Excel(name = "消息类型：1-系统消息")
    private Long type;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 对象id */
    @Excel(name = "对象id")
    private Long objectId;

    /** 是否已读：1-是 2-否 */
    @Excel(name = "是否已读：1-是 2-否")
    private Long isRead;

    /**
     * 未读消息数量
     */
    private Long unReadNum;

    /**
     * 最新消息对象
     */
    private UserMessage latestUserMessage;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSketch() {
        return sketch;
    }

    public void setSketch(String sketch) {
        this.sketch = sketch;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getUnReadNum() {
        return unReadNum;
    }

    public void setUnReadNum(Long unReadNum) {
        this.unReadNum = unReadNum;
    }

    public UserMessage getLatestUserMessage() {
        return latestUserMessage;
    }

    public void setLatestUserMessage(UserMessage latestUserMessage) {
        this.latestUserMessage = latestUserMessage;
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
    public void setType(Long type) 
    {
        this.type = type;
    }

    public Long getType() 
    {
        return type;
    }
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
    }
    public void setObjectId(Long objectId) 
    {
        this.objectId = objectId;
    }

    public Long getObjectId() 
    {
        return objectId;
    }
    public void setIsRead(Long isRead) 
    {
        this.isRead = isRead;
    }

    public Long getIsRead() 
    {
        return isRead;
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
            .append("sketchZh", getSketchZh())
            .append("sketchEn", getSketchEn())
            .append("contentZh", getContentZh())
            .append("contentEn", getContentEn())
            .append("type", getType())
            .append("userId", getUserId())
            .append("objectId", getObjectId())
            .append("isRead", getIsRead())
            .toString();
    }
}
