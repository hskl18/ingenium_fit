package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.Agreement;

/**
 * 协议Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface AgreementMapper 
{
    /**
     * 查询协议
     * 
     * @param id 协议主键
     * @return 协议
     */
    public Agreement selectAgreementById(Long id);

    /**
     * 查询协议列表
     * 
     * @param agreement 协议
     * @return 协议集合
     */
    public List<Agreement> selectAgreementList(Agreement agreement);

    /**
     * 新增协议
     * 
     * @param agreement 协议
     * @return 结果
     */
    public int insertAgreement(Agreement agreement);

    /**
     * 修改协议
     * 
     * @param agreement 协议
     * @return 结果
     */
    public int updateAgreement(Agreement agreement);

    /**
     * 删除协议
     * 
     * @param id 协议主键
     * @return 结果
     */
    public int deleteAgreementById(Long id);

    /**
     * 批量删除协议
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteAgreementByIds(Long[] ids);
}
