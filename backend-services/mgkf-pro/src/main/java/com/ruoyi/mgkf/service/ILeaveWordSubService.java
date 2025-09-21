package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.LeaveWordSub;

/**
 * 留言子Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface ILeaveWordSubService 
{
    /**
     * 查询留言子
     * 
     * @param id 留言子主键
     * @return 留言子
     */
    public LeaveWordSub selectLeaveWordSubById(Long id);

    /**
     * 查询留言子列表
     * 
     * @param leaveWordSub 留言子
     * @return 留言子集合
     */
    public List<LeaveWordSub> selectLeaveWordSubList(LeaveWordSub leaveWordSub);

    /**
     * 新增留言子
     * 
     * @param leaveWordSub 留言子
     * @return 结果
     */
    public int insertLeaveWordSub(LeaveWordSub leaveWordSub);

    /**
     * 修改留言子
     * 
     * @param leaveWordSub 留言子
     * @return 结果
     */
    public int updateLeaveWordSub(LeaveWordSub leaveWordSub);

    /**
     * 批量删除留言子
     * 
     * @param ids 需要删除的留言子主键集合
     * @return 结果
     */
    public int deleteLeaveWordSubByIds(Long[] ids);

    /**
     * 删除留言子信息
     * 
     * @param id 留言子主键
     * @return 结果
     */
    public int deleteLeaveWordSubById(Long id);

    void handlerLeaveWordSubList(List<LeaveWordSub> leaveWordSubList, List<String> handlerOptions);

    /**
     * 设置消息已读
     */
    void readMessage(Long leaveWordId, Long userId);

    Map<Long, LeaveWordSub> selectLatestMessageByLeaveWordIdList(List<Long> leaveWordIdList);

    Map<Long, Long> selectUnReadMessageNumByLeaveWordIdList(List<Long> leaveWordIdList, Long userId);

    NumberStatisticsVo numberStatistics();
}
