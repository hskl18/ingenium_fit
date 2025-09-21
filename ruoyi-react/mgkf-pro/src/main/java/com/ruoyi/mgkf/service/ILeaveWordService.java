package com.ruoyi.mgkf.service;

import java.util.List;
import com.ruoyi.mgkf.domain.LeaveWord;

/**
 * 留言Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface ILeaveWordService 
{
    /**
     * 查询留言
     * 
     * @param id 留言主键
     * @return 留言
     */
    public LeaveWord selectLeaveWordById(Long id);

    /**
     * 查询留言列表
     * 
     * @param leaveWord 留言
     * @return 留言集合
     */
    public List<LeaveWord> selectLeaveWordList(LeaveWord leaveWord);

    /**
     * 新增留言
     * 
     * @param leaveWord 留言
     * @return 结果
     */
    public int insertLeaveWord(LeaveWord leaveWord);

    /**
     * 修改留言
     * 
     * @param leaveWord 留言
     * @return 结果
     */
    public int updateLeaveWord(LeaveWord leaveWord);

    /**
     * 批量删除留言
     * 
     * @param ids 需要删除的留言主键集合
     * @return 结果
     */
    public int deleteLeaveWordByIds(Long[] ids);

    /**
     * 删除留言信息
     * 
     * @param id 留言主键
     * @return 结果
     */
    public int deleteLeaveWordById(Long id);

    LeaveWord createAndGetLeaveWordByUserId(LeaveWord.LeaveWordDetailBo bo);

    void handlerLeaveWordList(List<LeaveWord> leaveWordList, List<String> selectOptions);

    LeaveWord unReadNumAndLatest(Long userId);
}
