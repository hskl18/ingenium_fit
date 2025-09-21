package com.ruoyi.mgkf.service.impl;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.system.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.UserMessageMapper;
import com.ruoyi.mgkf.domain.UserMessage;
import com.ruoyi.mgkf.service.IUserMessageService;

/**
 * 用户消息Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-22
 */
@Service
public class UserMessageServiceImpl implements IUserMessageService 
{
    @Autowired
    private UserMessageMapper userMessageMapper;

    /**
     * 查询用户消息
     * 
     * @param id 用户消息主键
     * @return 用户消息
     */
    @Override
    public UserMessage selectUserMessageById(Long id)
    {
        return userMessageMapper.selectUserMessageById(id);
    }

    /**
     * 查询用户消息列表
     * 
     * @param userMessage 用户消息
     * @return 用户消息
     */
    @Override
    public List<UserMessage> selectUserMessageList(UserMessage userMessage)
    {
        return userMessageMapper.selectUserMessageList(userMessage);
    }

    /**
     * 新增用户消息
     * 
     * @param userMessage 用户消息
     * @return 结果
     */
    @Override
    public int insertUserMessage(UserMessage userMessage)
    {
        userMessage.setCreateTime(DateUtils.getNowDate());
        return userMessageMapper.insertUserMessage(userMessage);
    }

    /**
     * 修改用户消息
     * 
     * @param userMessage 用户消息
     * @return 结果
     */
    @Override
    public int updateUserMessage(UserMessage userMessage)
    {
        userMessage.setUpdateTime(DateUtils.getNowDate());
        return userMessageMapper.updateUserMessage(userMessage);
    }

    /**
     * 批量删除用户消息
     * 
     * @param ids 需要删除的用户消息主键
     * @return 结果
     */
    @Override
    public int deleteUserMessageByIds(Long[] ids)
    {
        return userMessageMapper.deleteUserMessageByIds(ids);
    }

    /**
     * 删除用户消息信息
     * 
     * @param id 用户消息主键
     * @return 结果
     */
    @Override
    public int deleteUserMessageById(Long id)
    {
        return userMessageMapper.deleteUserMessageById(id);
    }

    @Override
    public void insertBatch(List<UserMessage> userMessageList) {
        userMessageMapper.insertBatch(userMessageList);
    }

    @Override
    public UserMessage unReadNumAndLatest(Long userId) {
        UserMessage userMessage = new UserMessage();
        userMessage.setUnReadNum(userMessageMapper.selectUnReadNum(userId));
        UserMessage latestUserMessage = userMessageMapper.selectLatestMessage(userId);
        if (latestUserMessage != null) {
            handlerUserMessageList(List.of(latestUserMessage), List.of("lang"));
        }
        userMessage.setLatestUserMessage(latestUserMessage);
        return userMessage;
    }

    @Override
    public void updateReadByUserId(Long userId) {
        userMessageMapper.updateReadByUserId(userId);
    }

    @Override
    public void handlerUserMessageList(List<UserMessage> userMessageList, List<String> selectOptions) {
        if (CollectionUtil.isEmpty(userMessageList)) {
            return;
        }
        for (UserMessage userMessage : userMessageList) {
            if (selectOptions.contains("lang")) {
                userMessage.setTitle(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, userMessage.getTitleZh(),
                            LanguageConstant.EN, userMessage.getTitleEn()
                        )
                    )
                );
                userMessage.setSketch(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, userMessage.getSketchZh(),
                            LanguageConstant.EN, userMessage.getSketchEn()
                        )
                    )
                );
                userMessage.setContent(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, userMessage.getContentZh(),
                            LanguageConstant.EN, userMessage.getContentEn()
                        )
                    )
                );
            }
        }
    }
}
