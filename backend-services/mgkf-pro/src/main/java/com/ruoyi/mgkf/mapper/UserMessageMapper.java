package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.UserMessage;
import org.apache.ibatis.annotations.Param;

/**
 * 用户消息Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-22
 */
public interface UserMessageMapper 
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
     * 删除用户消息
     * 
     * @param id 用户消息主键
     * @return 结果
     */
    public int deleteUserMessageById(Long id);

    /**
     * 批量删除用户消息
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteUserMessageByIds(Long[] ids);

    void insertBatch(@Param("list") List<UserMessage> userMessageList);

    Long selectUnReadNum(Long userId);

    UserMessage selectLatestMessage(Long userId);

    void updateReadByUserId(Long userId);
}
