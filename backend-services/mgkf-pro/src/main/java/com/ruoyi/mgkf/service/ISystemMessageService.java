package com.ruoyi.mgkf.service;

import java.util.List;
import com.ruoyi.mgkf.domain.SystemMessage;

/**
 * 系统消息Service接口
 * 
 * @author ruoyi
 * @date 2025-08-22
 */
public interface ISystemMessageService 
{
    /**
     * 查询系统消息
     * 
     * @param id 系统消息主键
     * @return 系统消息
     */
    public SystemMessage selectSystemMessageById(Long id);

    /**
     * 查询系统消息列表
     * 
     * @param systemMessage 系统消息
     * @return 系统消息集合
     */
    public List<SystemMessage> selectSystemMessageList(SystemMessage systemMessage);

    /**
     * 新增系统消息
     * 
     * @param systemMessage 系统消息
     * @return 结果
     */
    public int insertSystemMessage(SystemMessage systemMessage);

    /**
     * 修改系统消息
     * 
     * @param systemMessage 系统消息
     * @return 结果
     */
    public int updateSystemMessage(SystemMessage systemMessage);

    /**
     * 批量删除系统消息
     * 
     * @param ids 需要删除的系统消息主键集合
     * @return 结果
     */
    public int deleteSystemMessageByIds(Long[] ids);

    /**
     * 删除系统消息信息
     * 
     * @param id 系统消息主键
     * @return 结果
     */
    public int deleteSystemMessageById(Long id);
}
