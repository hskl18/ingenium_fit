package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 版本对象 t_app_version
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public class AppVersion extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long id;

    /** 1-正常 2-删除 3-禁用 */
    private Long delFlag;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 版本号 */
    @Excel(name = "版本号")
    private String versionNo;

    /** 是否强制：1-强制 2-不强制 */
    @Excel(name = "是否强制：1-强制 2-不强制")
    private Long isForce;

    /** 版本地址 */
    @Excel(name = "版本地址")
    private String url;

    /** 设备类型：1-安卓 2-ios */
    @Excel(name = "设备类型：1-安卓 2-ios")
    private Long appType;

    /** 更新内容 */
    @Excel(name = "更新内容")
    private String content;

    /** 标题 */
    @Excel(name = "标题")
    private String title;

    /** 端口 */
    @Excel(name = "端口")
    private Long port;

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
    public void setVersionNo(String versionNo) 
    {
        this.versionNo = versionNo;
    }

    public String getVersionNo() 
    {
        return versionNo;
    }
    public void setIsForce(Long isForce) 
    {
        this.isForce = isForce;
    }

    public Long getIsForce() 
    {
        return isForce;
    }
    public void setUrl(String url) 
    {
        this.url = url;
    }

    public String getUrl() 
    {
        return url;
    }
    public void setAppType(Long appType) 
    {
        this.appType = appType;
    }

    public Long getAppType() 
    {
        return appType;
    }
    public void setContent(String content) 
    {
        this.content = content;
    }

    public String getContent() 
    {
        return content;
    }
    public void setTitle(String title) 
    {
        this.title = title;
    }

    public String getTitle() 
    {
        return title;
    }
    public void setPort(Long port) 
    {
        this.port = port;
    }

    public Long getPort() 
    {
        return port;
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
            .append("versionNo", getVersionNo())
            .append("isForce", getIsForce())
            .append("url", getUrl())
            .append("appType", getAppType())
            .append("content", getContent())
            .append("title", getTitle())
            .append("port", getPort())
            .toString();
    }
}
