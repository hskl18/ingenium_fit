package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.UserCommentReplyMapper;
import com.ruoyi.mgkf.domain.UserCommentReply;
import com.ruoyi.mgkf.service.IUserCommentReplyService;

/**
 * 评论回复Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class UserCommentReplyServiceImpl implements IUserCommentReplyService 
{
    @Autowired
    private UserCommentReplyMapper userCommentReplyMapper;

    @Resource
    private IUserService userService;

    /**
     * 查询评论回复
     * 
     * @param id 评论回复主键
     * @return 评论回复
     */
    @Override
    public UserCommentReply selectUserCommentReplyById(Long id)
    {
        return userCommentReplyMapper.selectUserCommentReplyById(id);
    }

    /**
     * 查询评论回复列表
     * 
     * @param userCommentReply 评论回复
     * @return 评论回复
     */
    @Override
    public List<UserCommentReply> selectUserCommentReplyList(UserCommentReply userCommentReply)
    {
        return userCommentReplyMapper.selectUserCommentReplyList(userCommentReply);
    }

    /**
     * 新增评论回复
     * 
     * @param userCommentReply 评论回复
     * @return 结果
     */
    @Override
    public int insertUserCommentReply(UserCommentReply userCommentReply)
    {
        userCommentReply.setCreateTime(DateUtils.getNowDate());
        return userCommentReplyMapper.insertUserCommentReply(userCommentReply);
    }

    /**
     * 修改评论回复
     * 
     * @param userCommentReply 评论回复
     * @return 结果
     */
    @Override
    public int updateUserCommentReply(UserCommentReply userCommentReply)
    {
        userCommentReply.setUpdateTime(DateUtils.getNowDate());
        return userCommentReplyMapper.updateUserCommentReply(userCommentReply);
    }

    /**
     * 批量删除评论回复
     * 
     * @param ids 需要删除的评论回复主键
     * @return 结果
     */
    @Override
    public int deleteUserCommentReplyByIds(Long[] ids)
    {
        return userCommentReplyMapper.deleteUserCommentReplyByIds(ids);
    }

    /**
     * 删除评论回复信息
     * 
     * @param id 评论回复主键
     * @return 结果
     */
    @Override
    public int deleteUserCommentReplyById(Long id)
    {
        return userCommentReplyMapper.deleteUserCommentReplyById(id);
    }

    @Override
    public Map<Long, List<UserCommentReply>> selectMapByUserCommentIdList(List<Long> userCommentIdList) {
        UserCommentReply userCommentReply = new UserCommentReply();
        userCommentReply.setDelFlag(PublicCommon.ENABLE);
        userCommentReply.setUserCommentIdList(userCommentIdList);
        List<UserCommentReply> userCommentReplyList = userCommentReplyMapper.selectUserCommentReplyList(userCommentReply);
        return CollectionUtil.isNotEmpty(userCommentReplyList) ? userCommentReplyList.stream().collect(Collectors.groupingBy(UserCommentReply::getUserCommentId)) : new HashMap<>();
    }

    /**
     * 处理评论回复列表
     */
    @Override
    public void handlerUserCommentReplyList(List<UserCommentReply> userCommentReplyList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(userCommentReplyList)) {
            return;
        }

        List<Long> userIdList = userCommentReplyList.stream().flatMap(x -> Stream.of(x.getUserId(), x.getReplyUserId()))
            .filter(Objects::nonNull).toList();

        Map<Long, User> userMap = new HashMap<>();

        if (handlerOptions.contains("selectUserInfo")) {
            userMap = userService.selectMapByIds(userIdList);
        }

        for (UserCommentReply userCommentReply : userCommentReplyList) {
            if (handlerOptions.contains("selectUserInfo")) {
                Long userId = userCommentReply.getUserId();
                if (userId != null) {
                    userCommentReply.setUser(userMap.get(userId));
                }
                Long replyUserId = userCommentReply.getReplyUserId();
                if (replyUserId != null) {
                    userCommentReply.setReplyUser(userMap.get(replyUserId));
                }
            }
        }
    }
}
