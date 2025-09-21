package com.ruoyi.mgkf.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.domain.UserCommentReply;

/**
 * 评论回复Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IUserCommentReplyService 
{
    /**
     * 查询评论回复
     * 
     * @param id 评论回复主键
     * @return 评论回复
     */
    public UserCommentReply selectUserCommentReplyById(Long id);

    /**
     * 查询评论回复列表
     * 
     * @param userCommentReply 评论回复
     * @return 评论回复集合
     */
    public List<UserCommentReply> selectUserCommentReplyList(UserCommentReply userCommentReply);

    /**
     * 新增评论回复
     * 
     * @param userCommentReply 评论回复
     * @return 结果
     */
    public int insertUserCommentReply(UserCommentReply userCommentReply);

    /**
     * 修改评论回复
     * 
     * @param userCommentReply 评论回复
     * @return 结果
     */
    public int updateUserCommentReply(UserCommentReply userCommentReply);

    /**
     * 批量删除评论回复
     * 
     * @param ids 需要删除的评论回复主键集合
     * @return 结果
     */
    public int deleteUserCommentReplyByIds(Long[] ids);

    /**
     * 删除评论回复信息
     * 
     * @param id 评论回复主键
     * @return 结果
     */
    public int deleteUserCommentReplyById(Long id);

    Map<Long, List<UserCommentReply>> selectMapByUserCommentIdList(List<Long> userCommentIdList);

    /**
     * 处理评论回复列表
     */
    void handlerUserCommentReplyList(List<UserCommentReply> userCommentReplyList, List<String> handlerOptions);
}
