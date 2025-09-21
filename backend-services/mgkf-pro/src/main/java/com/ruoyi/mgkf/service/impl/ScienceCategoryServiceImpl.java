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
import com.ruoyi.mgkf.mapper.ScienceCategoryMapper;
import com.ruoyi.mgkf.domain.ScienceCategory;
import com.ruoyi.mgkf.service.IScienceCategoryService;

/**
 * 科普分类Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class ScienceCategoryServiceImpl implements IScienceCategoryService 
{
    @Autowired
    private ScienceCategoryMapper scienceCategoryMapper;

    /**
     * 查询科普分类
     * 
     * @param id 科普分类主键
     * @return 科普分类
     */
    @Override
    public ScienceCategory selectScienceCategoryById(Long id)
    {
        return scienceCategoryMapper.selectScienceCategoryById(id);
    }

    /**
     * 查询科普分类列表
     * 
     * @param scienceCategory 科普分类
     * @return 科普分类
     */
    @Override
    public List<ScienceCategory> selectScienceCategoryList(ScienceCategory scienceCategory)
    {
        return scienceCategoryMapper.selectScienceCategoryList(scienceCategory);
    }

    /**
     * 新增科普分类
     * 
     * @param scienceCategory 科普分类
     * @return 结果
     */
    @Override
    public int insertScienceCategory(ScienceCategory scienceCategory)
    {
        scienceCategory.setCreateTime(DateUtils.getNowDate());
        return scienceCategoryMapper.insertScienceCategory(scienceCategory);
    }

    /**
     * 修改科普分类
     * 
     * @param scienceCategory 科普分类
     * @return 结果
     */
    @Override
    public int updateScienceCategory(ScienceCategory scienceCategory)
    {
        scienceCategory.setUpdateTime(DateUtils.getNowDate());
        return scienceCategoryMapper.updateScienceCategory(scienceCategory);
    }

    /**
     * 批量删除科普分类
     * 
     * @param ids 需要删除的科普分类主键
     * @return 结果
     */
    @Override
    public int deleteScienceCategoryByIds(Long[] ids)
    {
        return scienceCategoryMapper.deleteScienceCategoryByIds(ids);
    }

    /**
     * 删除科普分类信息
     * 
     * @param id 科普分类主键
     * @return 结果
     */
    @Override
    public int deleteScienceCategoryById(Long id)
    {
        return scienceCategoryMapper.deleteScienceCategoryById(id);
    }

    /**
     * 处理科普分类查询结果
     */
    @Override
    public void handlerScienceCategoryList(List<ScienceCategory> scienceCategoryList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(scienceCategoryList)) {
            return;
        }

        for (ScienceCategory scienceCategory : scienceCategoryList) {
            // 语言切换
            if (handlerOptions.contains("lang")) {
                scienceCategory.setName(
                    LanguageUtil.getResponseByLanguage(
                        new HashMap<>() {{
                            put(LanguageConstant.ZH, scienceCategory.getNameZh());
                            put(LanguageConstant.EN, scienceCategory.getNameEn());
                        }}
                    )
                );
            }
        }
    }

    @Override
    public Map<Long, ScienceCategory> selectMapByIds(List<Long> scienceCategoryIdList) {
        ScienceCategory scienceCategory = new ScienceCategory();
        scienceCategory.setScienceCategoryIdList(scienceCategoryIdList);
        List<ScienceCategory> scienceCategoryList = scienceCategoryMapper.selectScienceCategoryList(scienceCategory);
        return CollectionUtil.isNotEmpty(scienceCategoryList) ?
            scienceCategoryList.stream().collect(Collectors.toMap(ScienceCategory::getId, s -> s)) : new HashMap<>();
    }
}
