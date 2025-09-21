package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.UserComment;

/**
 * 用户评论Service接口
 *
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IUserCommentService {
    /**
     * 查询用户评论
     *
     * @param id 用户评论主键
     * @return 用户评论
     */
    public UserComment selectUserCommentById(Long id);

    /**
     * 查询用户评论列表
     *
     * @param userComment 用户评论
     * @return 用户评论集合
     */
    public List<UserComment> selectUserCommentList(UserComment userComment);

    /**
     * 新增用户评论
     *
     * @param userComment 用户评论
     * @return 结果
     */
    public int insertUserComment(UserComment userComment);

    /**
     * 修改用户评论
     *
     * @param userComment 用户评论
     * @return 结果
     */
    public int updateUserComment(UserComment userComment);

    /**
     * 批量删除用户评论
     *
     * @param ids 需要删除的用户评论主键集合
     * @return 结果
     */
    public int deleteUserCommentByIds(Long[] ids);

    /**
     * 删除用户评论信息
     *
     * @param id 用户评论主键
     * @return 结果
     */
    public int deleteUserCommentById(Long id);

    /**
     * 计算星级
     *
     * @param objectId   对象id
     * @param objectType 对象类型
     */
    Double computeStar(Long objectId, Long objectType);

    /**
     * 处理评论查询结果
     */
    void handlerUserCommentList(List<UserComment> userCommentList, List<String> handleOptions);

    /**
     * 更新评论数
     *
     * @param objectType 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
     */
    void updateCommentNum(Long objectType, Long objectId);
}
