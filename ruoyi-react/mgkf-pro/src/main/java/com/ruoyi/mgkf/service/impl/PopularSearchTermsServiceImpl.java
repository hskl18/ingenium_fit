package com.ruoyi.mgkf.service.impl;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.system.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.PopularSearchTermsMapper;
import com.ruoyi.mgkf.domain.PopularSearchTerms;
import com.ruoyi.mgkf.service.IPopularSearchTermsService;

/**
 * 热门搜索词Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-20
 */
@Service
public class PopularSearchTermsServiceImpl implements IPopularSearchTermsService 
{
    @Autowired
    private PopularSearchTermsMapper popularSearchTermsMapper;

    /**
     * 查询热门搜索词
     * 
     * @param id 热门搜索词主键
     * @return 热门搜索词
     */
    @Override
    public PopularSearchTerms selectPopularSearchTermsById(Long id)
    {
        return popularSearchTermsMapper.selectPopularSearchTermsById(id);
    }

    /**
     * 查询热门搜索词列表
     * 
     * @param popularSearchTerms 热门搜索词
     * @return 热门搜索词
     */
    @Override
    public List<PopularSearchTerms> selectPopularSearchTermsList(PopularSearchTerms popularSearchTerms)
    {
        return popularSearchTermsMapper.selectPopularSearchTermsList(popularSearchTerms);
    }

    /**
     * 新增热门搜索词
     * 
     * @param popularSearchTerms 热门搜索词
     * @return 结果
     */
    @Override
    public int insertPopularSearchTerms(PopularSearchTerms popularSearchTerms)
    {
        popularSearchTerms.setCreateTime(DateUtils.getNowDate());
        return popularSearchTermsMapper.insertPopularSearchTerms(popularSearchTerms);
    }

    /**
     * 修改热门搜索词
     * 
     * @param popularSearchTerms 热门搜索词
     * @return 结果
     */
    @Override
    public int updatePopularSearchTerms(PopularSearchTerms popularSearchTerms)
    {
        popularSearchTerms.setUpdateTime(DateUtils.getNowDate());
        return popularSearchTermsMapper.updatePopularSearchTerms(popularSearchTerms);
    }

    /**
     * 批量删除热门搜索词
     * 
     * @param ids 需要删除的热门搜索词主键
     * @return 结果
     */
    @Override
    public int deletePopularSearchTermsByIds(Long[] ids)
    {
        return popularSearchTermsMapper.deletePopularSearchTermsByIds(ids);
    }

    /**
     * 删除热门搜索词信息
     * 
     * @param id 热门搜索词主键
     * @return 结果
     */
    @Override
    public int deletePopularSearchTermsById(Long id)
    {
        return popularSearchTermsMapper.deletePopularSearchTermsById(id);
    }

    @Override
    public void handlerPopularSearchTermsList(List<PopularSearchTerms> popularSearchTermsList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(popularSearchTermsList)) {
            return;
        }

        for (PopularSearchTerms popularSearchTerms : popularSearchTermsList) {
            // 语言切换
            if (handlerOptions.contains("lang")) {
                popularSearchTerms.setSearchTerms(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, popularSearchTerms.getSearchTermsZh(),
                            LanguageConstant.EN, popularSearchTerms.getSearchTermsEn()
                        )
                    )
                );
            }
        }
    }
}
