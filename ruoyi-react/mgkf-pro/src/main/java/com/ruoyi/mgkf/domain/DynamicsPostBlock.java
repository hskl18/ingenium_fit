package com.ruoyi.mgkf.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

import java.util.List;

/**
 * 动态帖子屏蔽对象 t_dynamics_post_block
 * 
 * @author ruoyi
 * @date 2025-08-20
 */
public class DynamicsPostBlock extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 租户号 */
    private Long id;

    /** 创建部门 */
    @Excel(name = "创建部门")
    private Long createDept;

    /** 删除标识 1 正常 2 删除 3 禁用 */
    private Long delFlag;

    /** 用户id */
    @Excel(name = "用户id")
    private Long userId;

    /** 屏蔽帖子id */
    @Excel(name = "屏蔽帖子id")
    private Long blockDynamicsPostId;

    /** 帖子id列表 */
    private List<Long> dynamicsPostIdList;

    public List<Long> getDynamicsPostIdList() {
        return dynamicsPostIdList;
    }

    public void setDynamicsPostIdList(List<Long> dynamicsPostIdList) {
        this.dynamicsPostIdList = dynamicsPostIdList;
    }

    public Long getBlockDynamicsPostId() {
        return blockDynamicsPostId;
    }

    public void setBlockDynamicsPostId(Long blockDynamicsPostId) {
        this.blockDynamicsPostId = blockDynamicsPostId;
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
    public void setUserId(Long userId) 
    {
        this.userId = userId;
    }

    public Long getUserId() 
    {
        return userId;
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
            .append("userId", getUserId())
            .toString();
    }
}
