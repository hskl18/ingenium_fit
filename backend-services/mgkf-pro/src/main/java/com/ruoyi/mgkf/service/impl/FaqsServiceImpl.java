package com.ruoyi.mgkf.service.impl;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.system.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.FaqsMapper;
import com.ruoyi.mgkf.domain.Faqs;
import com.ruoyi.mgkf.service.IFaqsService;

/**
 * 常见问题Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class FaqsServiceImpl implements IFaqsService 
{
    @Autowired
    private FaqsMapper faqsMapper;

    /**
     * 查询常见问题
     * 
     * @param id 常见问题主键
     * @return 常见问题
     */
    @Override
    public Faqs selectFaqsById(Long id)
    {
        return faqsMapper.selectFaqsById(id);
    }

    /**
     * 查询常见问题列表
     * 
     * @param faqs 常见问题
     * @return 常见问题
     */
    @Override
    public List<Faqs> selectFaqsList(Faqs faqs)
    {
        return faqsMapper.selectFaqsList(faqs);
    }

    /**
     * 新增常见问题
     * 
     * @param faqs 常见问题
     * @return 结果
     */
    @Override
    public int insertFaqs(Faqs faqs)
    {
        faqs.setCreateTime(DateUtils.getNowDate());
        return faqsMapper.insertFaqs(faqs);
    }

    /**
     * 修改常见问题
     * 
     * @param faqs 常见问题
     * @return 结果
     */
    @Override
    public int updateFaqs(Faqs faqs)
    {
        faqs.setUpdateTime(DateUtils.getNowDate());
        return faqsMapper.updateFaqs(faqs);
    }

    /**
     * 批量删除常见问题
     * 
     * @param ids 需要删除的常见问题主键
     * @return 结果
     */
    @Override
    public int deleteFaqsByIds(Long[] ids)
    {
        return faqsMapper.deleteFaqsByIds(ids);
    }

    /**
     * 删除常见问题信息
     * 
     * @param id 常见问题主键
     * @return 结果
     */
    @Override
    public int deleteFaqsById(Long id)
    {
        return faqsMapper.deleteFaqsById(id);
    }

    @Override
    public void handlerFaqsList(List<Faqs> faqsList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(faqsList)) {
            return;
        }

        for (Faqs faqs : faqsList) {
            if (handlerOptions.contains("lang")) {
                faqs.setTitle(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, faqs.getTitleZh(),
                            LanguageConstant.EN, faqs.getTitleEn()
                        )
                    )
                );
                faqs.setContent(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, faqs.getContentZh(),
                            LanguageConstant.EN, faqs.getContentEn()
                        )
                    )
                );
            }
        }
    }
}
