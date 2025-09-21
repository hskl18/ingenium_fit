package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.LeaveWordSub;
import org.apache.ibatis.annotations.Param;

/**
 * 留言子Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface LeaveWordSubMapper 
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
     * 删除留言子
     * 
     * @param id 留言子主键
     * @return 结果
     */
    public int deleteLeaveWordSubById(Long id);

    /**
     * 批量删除留言子
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteLeaveWordSubByIds(Long[] ids);

    /**
     * 设置消息已读
     */
    void readMessage(@Param("leaveWordId") Long leaveWordId, @Param("userId") Long userId);

    List<LeaveWordSub> selectLatestMessageByLeaveWordIdList(@Param("leaveWordIdList") List<Long> leaveWordIdList);

    List<LeaveWordSub> selectUnReadMessageByLeaveWordIdList(@Param("leaveWordIdList") List<Long> leaveWordIdList, @Param("userId") Long userId);

    Long selectCount();
}
