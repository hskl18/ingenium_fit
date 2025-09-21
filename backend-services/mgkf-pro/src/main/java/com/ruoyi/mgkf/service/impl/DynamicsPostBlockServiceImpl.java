package com.ruoyi.mgkf.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.DynamicsPostBlockMapper;
import com.ruoyi.mgkf.domain.DynamicsPostBlock;
import com.ruoyi.mgkf.service.IDynamicsPostBlockService;

/**
 * 动态帖子屏蔽Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-20
 */
@Service
public class DynamicsPostBlockServiceImpl implements IDynamicsPostBlockService 
{
    @Autowired
    private DynamicsPostBlockMapper dynamicsPostBlockMapper;

    /**
     * 查询动态帖子屏蔽
     * 
     * @param id 动态帖子屏蔽主键
     * @return 动态帖子屏蔽
     */
    @Override
    public DynamicsPostBlock selectDynamicsPostBlockById(Long id)
    {
        return dynamicsPostBlockMapper.selectDynamicsPostBlockById(id);
    }

    /**
     * 查询动态帖子屏蔽列表
     * 
     * @param dynamicsPostBlock 动态帖子屏蔽
     * @return 动态帖子屏蔽
     */
    @Override
    public List<DynamicsPostBlock> selectDynamicsPostBlockList(DynamicsPostBlock dynamicsPostBlock)
    {
        return dynamicsPostBlockMapper.selectDynamicsPostBlockList(dynamicsPostBlock);
    }

    /**
     * 新增动态帖子屏蔽
     * 
     * @param dynamicsPostBlock 动态帖子屏蔽
     * @return 结果
     */
    @Override
    public int insertDynamicsPostBlock(DynamicsPostBlock dynamicsPostBlock)
    {
        dynamicsPostBlock.setCreateTime(DateUtils.getNowDate());
        return dynamicsPostBlockMapper.insertDynamicsPostBlock(dynamicsPostBlock);
    }

    /**
     * 修改动态帖子屏蔽
     * 
     * @param dynamicsPostBlock 动态帖子屏蔽
     * @return 结果
     */
    @Override
    public int updateDynamicsPostBlock(DynamicsPostBlock dynamicsPostBlock)
    {
        dynamicsPostBlock.setUpdateTime(DateUtils.getNowDate());
        return dynamicsPostBlockMapper.updateDynamicsPostBlock(dynamicsPostBlock);
    }

    /**
     * 批量删除动态帖子屏蔽
     * 
     * @param ids 需要删除的动态帖子屏蔽主键
     * @return 结果
     */
    @Override
    public int deleteDynamicsPostBlockByIds(Long[] ids)
    {
        return dynamicsPostBlockMapper.deleteDynamicsPostBlockByIds(ids);
    }

    /**
     * 删除动态帖子屏蔽信息
     * 
     * @param id 动态帖子屏蔽主键
     * @return 结果
     */
    @Override
    public int deleteDynamicsPostBlockById(Long id)
    {
        return dynamicsPostBlockMapper.deleteDynamicsPostBlockById(id);
    }

    /**
     * 屏蔽动态帖子/取消屏蔽
     */
    @Override
    public void addDynamicsPostBlock(DynamicsPostBlock dynamicsPostBlock) {
        dynamicsPostBlockMapper.addDynamicsPostBlock(dynamicsPostBlock);
    }

    @Override
    public Map<Long, DynamicsPostBlock> selectMapByDynamicsPostIdListAndUserId(List<Long> dynamicsPostIdList, Long userId) {
        DynamicsPostBlock dynamicsPostBlock = new DynamicsPostBlock();
        dynamicsPostBlock.setDynamicsPostIdList(dynamicsPostIdList);
        dynamicsPostBlock.setUserId(userId);
        dynamicsPostBlock.setDelFlag(PublicCommon.ENABLE);
        List<DynamicsPostBlock> dynamicsPostBlockList = dynamicsPostBlockMapper.selectDynamicsPostBlockList(dynamicsPostBlock);
        return CollectionUtil.isNotEmpty(dynamicsPostBlockList) ? dynamicsPostBlockList.stream().collect(Collectors.toMap(DynamicsPostBlock::getBlockDynamicsPostId, s -> s)) : new HashMap<>();
    }

    @Override
    public List<Long> selectByUserId(Long userId) {
        DynamicsPostBlock dynamicsPostBlock = new DynamicsPostBlock();
        dynamicsPostBlock.setUserId(userId);
        dynamicsPostBlock.setDelFlag(PublicCommon.ENABLE);
        List<DynamicsPostBlock> dynamicsPostBlockList = dynamicsPostBlockMapper.selectDynamicsPostBlockList(dynamicsPostBlock);
        return CollectionUtil.isNotEmpty(dynamicsPostBlockList) ? dynamicsPostBlockList.stream().map(DynamicsPostBlock::getBlockDynamicsPostId).collect(Collectors.toList()) : new ArrayList<>();
    }
}
