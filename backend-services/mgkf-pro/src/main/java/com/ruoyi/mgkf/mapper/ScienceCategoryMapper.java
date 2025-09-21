package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.ScienceCategory;

/**
 * 科普分类Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface ScienceCategoryMapper 
{
    /**
     * 查询科普分类
     * 
     * @param id 科普分类主键
     * @return 科普分类
     */
    public ScienceCategory selectScienceCategoryById(Long id);

    /**
     * 查询科普分类列表
     * 
     * @param scienceCategory 科普分类
     * @return 科普分类集合
     */
    public List<ScienceCategory> selectScienceCategoryList(ScienceCategory scienceCategory);

    /**
     * 新增科普分类
     * 
     * @param scienceCategory 科普分类
     * @return 结果
     */
    public int insertScienceCategory(ScienceCategory scienceCategory);

    /**
     * 修改科普分类
     * 
     * @param scienceCategory 科普分类
     * @return 结果
     */
    public int updateScienceCategory(ScienceCategory scienceCategory);

    /**
     * 删除科普分类
     * 
     * @param id 科普分类主键
     * @return 结果
     */
    public int deleteScienceCategoryById(Long id);

    /**
     * 批量删除科普分类
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteScienceCategoryByIds(Long[] ids);
}
