package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.system.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.DynamicsPostCategoryMapper;
import com.ruoyi.mgkf.domain.DynamicsPostCategory;
import com.ruoyi.mgkf.service.IDynamicsPostCategoryService;

/**
 * 动态帖子分类Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class DynamicsPostCategoryServiceImpl implements IDynamicsPostCategoryService 
{
    @Autowired
    private DynamicsPostCategoryMapper dynamicsPostCategoryMapper;

    /**
     * 查询动态帖子分类
     * 
     * @param id 动态帖子分类主键
     * @return 动态帖子分类
     */
    @Override
    public DynamicsPostCategory selectDynamicsPostCategoryById(Long id)
    {
        return dynamicsPostCategoryMapper.selectDynamicsPostCategoryById(id);
    }

    /**
     * 查询动态帖子分类列表
     * 
     * @param dynamicsPostCategory 动态帖子分类
     * @return 动态帖子分类
     */
    @Override
    public List<DynamicsPostCategory> selectDynamicsPostCategoryList(DynamicsPostCategory dynamicsPostCategory)
    {
        return dynamicsPostCategoryMapper.selectDynamicsPostCategoryList(dynamicsPostCategory);
    }

    /**
     * 新增动态帖子分类
     * 
     * @param dynamicsPostCategory 动态帖子分类
     * @return 结果
     */
    @Override
    public int insertDynamicsPostCategory(DynamicsPostCategory dynamicsPostCategory)
    {
        dynamicsPostCategory.setCreateTime(DateUtils.getNowDate());
        return dynamicsPostCategoryMapper.insertDynamicsPostCategory(dynamicsPostCategory);
    }

    /**
     * 修改动态帖子分类
     * 
     * @param dynamicsPostCategory 动态帖子分类
     * @return 结果
     */
    @Override
    public int updateDynamicsPostCategory(DynamicsPostCategory dynamicsPostCategory)
    {
        dynamicsPostCategory.setUpdateTime(DateUtils.getNowDate());
        return dynamicsPostCategoryMapper.updateDynamicsPostCategory(dynamicsPostCategory);
    }

    /**
     * 批量删除动态帖子分类
     * 
     * @param ids 需要删除的动态帖子分类主键
     * @return 结果
     */
    @Override
    public int deleteDynamicsPostCategoryByIds(Long[] ids)
    {
        return dynamicsPostCategoryMapper.deleteDynamicsPostCategoryByIds(ids);
    }

    /**
     * 删除动态帖子分类信息
     * 
     * @param id 动态帖子分类主键
     * @return 结果
     */
    @Override
    public int deleteDynamicsPostCategoryById(Long id)
    {
        return dynamicsPostCategoryMapper.deleteDynamicsPostCategoryById(id);
    }

    @Override
    public void handlerDynamicsPostCategoryList(List<DynamicsPostCategory> dynamicsPostCategoryList, List<String> selectOptions) {
        if (CollectionUtil.isEmpty(dynamicsPostCategoryList)) {
            return;
        }

        for (DynamicsPostCategory dynamicsPostCategory : dynamicsPostCategoryList) {
            if (selectOptions.contains("lang")) {
                dynamicsPostCategory.setName(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, dynamicsPostCategory.getNameZh(),
                            LanguageConstant.EN, dynamicsPostCategory.getNameEn()
                        )
                    )
                );
            }
        }
    }

    @Override
    public Map<Long, DynamicsPostCategory> selectMapByIds(List<Long> dynamicsPostCategoryIdList) {
        DynamicsPostCategory dynamicsPostCategory = new DynamicsPostCategory();
        dynamicsPostCategory.setDynamicsPostCategoryIdList(dynamicsPostCategoryIdList);
        List<DynamicsPostCategory> dynamicsPostCategoryList = dynamicsPostCategoryMapper.selectDynamicsPostCategoryList(dynamicsPostCategory);
        return CollectionUtil.isNotEmpty(dynamicsPostCategoryList) ?
            dynamicsPostCategoryList.stream().collect(Collectors.toMap(DynamicsPostCategory::getId, s -> s)) : new HashMap<>();
    }
}
