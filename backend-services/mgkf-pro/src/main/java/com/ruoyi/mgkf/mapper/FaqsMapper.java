package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.Faqs;

/**
 * 常见问题Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface FaqsMapper 
{
    /**
     * 查询常见问题
     * 
     * @param id 常见问题主键
     * @return 常见问题
     */
    public Faqs selectFaqsById(Long id);

    /**
     * 查询常见问题列表
     * 
     * @param faqs 常见问题
     * @return 常见问题集合
     */
    public List<Faqs> selectFaqsList(Faqs faqs);

    /**
     * 新增常见问题
     * 
     * @param faqs 常见问题
     * @return 结果
     */
    public int insertFaqs(Faqs faqs);

    /**
     * 修改常见问题
     * 
     * @param faqs 常见问题
     * @return 结果
     */
    public int updateFaqs(Faqs faqs);

    /**
     * 删除常见问题
     * 
     * @param id 常见问题主键
     * @return 结果
     */
    public int deleteFaqsById(Long id);

    /**
     * 批量删除常见问题
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteFaqsByIds(Long[] ids);
}
