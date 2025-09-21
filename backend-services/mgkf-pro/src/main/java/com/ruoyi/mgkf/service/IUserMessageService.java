package com.ruoyi.mgkf.service;

import java.util.List;
import com.ruoyi.mgkf.domain.UserMessage;
import org.apache.ibatis.annotations.Param;

/**
 * 用户消息Service接口
 * 
 * @author ruoyi
 * @date 2025-08-22
 */
public interface IUserMessageService 
{
    /**
     * 查询用户消息
     * 
     * @param id 用户消息主键
     * @return 用户消息
     */
    public UserMessage selectUserMessageById(Long id);

    /**
     * 查询用户消息列表
     * 
     * @param userMessage 用户消息
     * @return 用户消息集合
     */
    public List<UserMessage> selectUserMessageList(UserMessage userMessage);

    /**
     * 新增用户消息
     * 
     * @param userMessage 用户消息
     * @return 结果
     */
    public int insertUserMessage(UserMessage userMessage);

    /**
     * 修改用户消息
     * 
     * @param userMessage 用户消息
     * @return 结果
     */
    public int updateUserMessage(UserMessage userMessage);

    /**
     * 批量删除用户消息
     * 
     * @param ids 需要删除的用户消息主键集合
     * @return 结果
     */
    public int deleteUserMessageByIds(Long[] ids);

    /**
     * 删除用户消息信息
     * 
     * @param id 用户消息主键
     * @return 结果
     */
    public int deleteUserMessageById(Long id);

    void insertBatch(List<UserMessage> userMessageList);

    UserMessage unReadNumAndLatest(Long userId);

    void handlerUserMessageList(List<UserMessage> userMessageList, List<String> selectOptions);

    void updateReadByUserId(Long userId);
}
