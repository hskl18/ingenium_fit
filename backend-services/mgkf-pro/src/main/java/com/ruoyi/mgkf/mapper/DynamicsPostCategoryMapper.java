package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.DynamicsPostCategory;

/**
 * 动态帖子分类Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface DynamicsPostCategoryMapper 
{
    /**
     * 查询动态帖子分类
     * 
     * @param id 动态帖子分类主键
     * @return 动态帖子分类
     */
    public DynamicsPostCategory selectDynamicsPostCategoryById(Long id);

    /**
     * 查询动态帖子分类列表
     * 
     * @param dynamicsPostCategory 动态帖子分类
     * @return 动态帖子分类集合
     */
    public List<DynamicsPostCategory> selectDynamicsPostCategoryList(DynamicsPostCategory dynamicsPostCategory);

    /**
     * 新增动态帖子分类
     * 
     * @param dynamicsPostCategory 动态帖子分类
     * @return 结果
     */
    public int insertDynamicsPostCategory(DynamicsPostCategory dynamicsPostCategory);

    /**
     * 修改动态帖子分类
     * 
     * @param dynamicsPostCategory 动态帖子分类
     * @return 结果
     */
    public int updateDynamicsPostCategory(DynamicsPostCategory dynamicsPostCategory);

    /**
     * 删除动态帖子分类
     * 
     * @param id 动态帖子分类主键
     * @return 结果
     */
    public int deleteDynamicsPostCategoryById(Long id);

    /**
     * 批量删除动态帖子分类
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteDynamicsPostCategoryByIds(Long[] ids);
}
