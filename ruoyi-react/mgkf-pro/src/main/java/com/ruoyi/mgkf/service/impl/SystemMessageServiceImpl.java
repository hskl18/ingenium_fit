package com.ruoyi.mgkf.service.impl;

import java.util.List;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.domain.UserMessage;
import com.ruoyi.mgkf.mapper.UserMapper;
import com.ruoyi.mgkf.service.IUserMessageService;
import jakarta.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.SystemMessageMapper;
import com.ruoyi.mgkf.domain.SystemMessage;
import com.ruoyi.mgkf.service.ISystemMessageService;

/**
 * 系统消息Service业务层处理
 *
 * @author ruoyi
 * @date 2025-08-22
 */
@Service
public class SystemMessageServiceImpl implements ISystemMessageService {
    @Autowired
    private SystemMessageMapper systemMessageMapper;

    @Resource
    private ThreadPoolTaskExecutor threadPoolTaskExecutor;

    @Resource
    private UserMapper userMapper;

    @Resource
    private IUserMessageService userMessageService;

    /**
     * 查询系统消息
     *
     * @param id 系统消息主键
     * @return 系统消息
     */
    @Override
    public SystemMessage selectSystemMessageById(Long id) {
        return systemMessageMapper.selectSystemMessageById(id);
    }

    /**
     * 查询系统消息列表
     *
     * @param systemMessage 系统消息
     * @return 系统消息
     */
    @Override
    public List<SystemMessage> selectSystemMessageList(SystemMessage systemMessage) {
        return systemMessageMapper.selectSystemMessageList(systemMessage);
    }

    /**
     * 新增系统消息
     *
     * @param systemMessage 系统消息
     * @return 结果
     */
    @Override
    public int insertSystemMessage(SystemMessage systemMessage) {
        systemMessage.setCreateTime(DateUtils.getNowDate());
        int updateRow = systemMessageMapper.insertSystemMessage(systemMessage);
        if (updateRow > 0 && systemMessage.getIsPublish() != null && systemMessage.getIsPublish() == 1) {
            publishSystemMessage(systemMessage);
        }
        return updateRow;
    }

    /**
     * 修改系统消息
     *
     * @param systemMessage 系统消息
     * @return 结果
     */
    @Override
    public int updateSystemMessage(SystemMessage systemMessage) {
        systemMessage.setUpdateTime(DateUtils.getNowDate());
        int updateRow = systemMessageMapper.updateSystemMessage(systemMessage);
        if (updateRow > 0 && systemMessage.getIsPublish() != null && systemMessage.getIsPublish() == 1) {
            publishSystemMessage(systemMessage);
        }
        return updateRow;
    }

    /**
     * 发布系统消息
     */
    private void publishSystemMessage(SystemMessage systemMessage) {
        threadPoolTaskExecutor.execute(() -> {
            if (systemMessage == null) {
                return;
            }
            List<User> userList = userMapper.selectUserList(new User());
            if (CollectionUtil.isEmpty(userList)) {
                return;
            }
            userMessageService.insertBatch(userList.stream().map(x -> {
                UserMessage um = new UserMessage();
                um.setTitleZh(systemMessage.getTitleZh());
                um.setTitleEn(systemMessage.getTitleEn());
                um.setSketchZh(systemMessage.getSketchZh());
                um.setSketchEn(systemMessage.getSketchEn());
                um.setContentZh(systemMessage.getContentZh());
                um.setContentEn(systemMessage.getContentEn());
                um.setCreateTime(DateUtils.getNowDate());
                um.setType(1L);
                um.setUserId(x.getId());
                return um;
            }).toList());
        });
    }

    /**
     * 批量删除系统消息
     *
     * @param ids 需要删除的系统消息主键
     * @return 结果
     */
    @Override
    public int deleteSystemMessageByIds(Long[] ids) {
        return systemMessageMapper.deleteSystemMessageByIds(ids);
    }

    /**
     * 删除系统消息信息
     *
     * @param id 系统消息主键
     * @return 结果
     */
    @Override
    public int deleteSystemMessageById(Long id) {
        return systemMessageMapper.deleteSystemMessageById(id);
    }
}
