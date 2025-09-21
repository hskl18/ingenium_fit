package com.ruoyi.mgkf.service.impl;

import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.system.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.AgreementMapper;
import com.ruoyi.mgkf.domain.Agreement;
import com.ruoyi.mgkf.service.IAgreementService;

/**
 * 协议Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class AgreementServiceImpl implements IAgreementService 
{
    @Autowired
    private AgreementMapper agreementMapper;

    /**
     * 查询协议
     * 
     * @param id 协议主键
     * @return 协议
     */
    @Override
    public Agreement selectAgreementById(Long id)
    {
        return agreementMapper.selectAgreementById(id);
    }

    /**
     * 查询协议列表
     * 
     * @param agreement 协议
     * @return 协议
     */
    @Override
    public List<Agreement> selectAgreementList(Agreement agreement)
    {
        return agreementMapper.selectAgreementList(agreement);
    }

    /**
     * 新增协议
     * 
     * @param agreement 协议
     * @return 结果
     */
    @Override
    public int insertAgreement(Agreement agreement)
    {
        agreement.setCreateTime(DateUtils.getNowDate());
        return agreementMapper.insertAgreement(agreement);
    }

    /**
     * 修改协议
     * 
     * @param agreement 协议
     * @return 结果
     */
    @Override
    public int updateAgreement(Agreement agreement)
    {
        agreement.setUpdateTime(DateUtils.getNowDate());
        return agreementMapper.updateAgreement(agreement);
    }

    /**
     * 批量删除协议
     * 
     * @param ids 需要删除的协议主键
     * @return 结果
     */
    @Override
    public int deleteAgreementByIds(Long[] ids)
    {
        return agreementMapper.deleteAgreementByIds(ids);
    }

    /**
     * 删除协议信息
     * 
     * @param id 协议主键
     * @return 结果
     */
    @Override
    public int deleteAgreementById(Long id)
    {
        return agreementMapper.deleteAgreementById(id);
    }

    /**
     * 处理协议查询结果
     */
    @Override
    public void handlerAgreementList(List<Agreement> agreementList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(agreementList)) {
            return;
        }

        for (Agreement agreement : agreementList) {
            // 语言切换
            if (handlerOptions.contains("lang")) {
                agreement.setTitle(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, agreement.getTitleZh(),
                            LanguageConstant.EN, agreement.getTitleEn()
                        )
                    )
                );
                agreement.setContent(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, agreement.getContentZh(),
                            LanguageConstant.EN, agreement.getContentEn()
                        )
                    )
                );
            }
        }
    }
}
