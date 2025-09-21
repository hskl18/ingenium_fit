package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.domain.DynamicsPostBlock;

/**
 * 动态帖子屏蔽Service接口
 * 
 * @author ruoyi
 * @date 2025-08-20
 */
public interface IDynamicsPostBlockService 
{
    /**
     * 查询动态帖子屏蔽
     * 
     * @param id 动态帖子屏蔽主键
     * @return 动态帖子屏蔽
     */
    public DynamicsPostBlock selectDynamicsPostBlockById(Long id);

    /**
     * 查询动态帖子屏蔽列表
     * 
     * @param dynamicsPostBlock 动态帖子屏蔽
     * @return 动态帖子屏蔽集合
     */
    public List<DynamicsPostBlock> selectDynamicsPostBlockList(DynamicsPostBlock dynamicsPostBlock);

    /**
     * 新增动态帖子屏蔽
     * 
     * @param dynamicsPostBlock 动态帖子屏蔽
     * @return 结果
     */
    public int insertDynamicsPostBlock(DynamicsPostBlock dynamicsPostBlock);

    /**
     * 修改动态帖子屏蔽
     * 
     * @param dynamicsPostBlock 动态帖子屏蔽
     * @return 结果
     */
    public int updateDynamicsPostBlock(DynamicsPostBlock dynamicsPostBlock);

    /**
     * 批量删除动态帖子屏蔽
     * 
     * @param ids 需要删除的动态帖子屏蔽主键集合
     * @return 结果
     */
    public int deleteDynamicsPostBlockByIds(Long[] ids);

    /**
     * 删除动态帖子屏蔽信息
     * 
     * @param id 动态帖子屏蔽主键
     * @return 结果
     */
    public int deleteDynamicsPostBlockById(Long id);

    /**
     * 屏蔽动态帖子/取消屏蔽
     */
    void addDynamicsPostBlock(DynamicsPostBlock dynamicsPostBlock);

    Map<Long, DynamicsPostBlock> selectMapByDynamicsPostIdListAndUserId(List<Long> dynamicsPostIdList, Long userId);

    List<Long> selectByUserId(Long userId);
}
