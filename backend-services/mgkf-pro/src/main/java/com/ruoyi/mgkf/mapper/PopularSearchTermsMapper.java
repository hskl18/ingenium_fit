package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.PopularSearchTerms;

/**
 * 热门搜索词Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-20
 */
public interface PopularSearchTermsMapper 
{
    /**
     * 查询热门搜索词
     * 
     * @param id 热门搜索词主键
     * @return 热门搜索词
     */
    public PopularSearchTerms selectPopularSearchTermsById(Long id);

    /**
     * 查询热门搜索词列表
     * 
     * @param popularSearchTerms 热门搜索词
     * @return 热门搜索词集合
     */
    public List<PopularSearchTerms> selectPopularSearchTermsList(PopularSearchTerms popularSearchTerms);

    /**
     * 新增热门搜索词
     * 
     * @param popularSearchTerms 热门搜索词
     * @return 结果
     */
    public int insertPopularSearchTerms(PopularSearchTerms popularSearchTerms);

    /**
     * 修改热门搜索词
     * 
     * @param popularSearchTerms 热门搜索词
     * @return 结果
     */
    public int updatePopularSearchTerms(PopularSearchTerms popularSearchTerms);

    /**
     * 删除热门搜索词
     * 
     * @param id 热门搜索词主键
     * @return 结果
     */
    public int deletePopularSearchTermsById(Long id);

    /**
     * 批量删除热门搜索词
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deletePopularSearchTermsByIds(Long[] ids);
}
