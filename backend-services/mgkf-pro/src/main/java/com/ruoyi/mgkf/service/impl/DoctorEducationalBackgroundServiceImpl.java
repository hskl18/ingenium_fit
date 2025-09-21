package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.system.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.DoctorEducationalBackgroundMapper;
import com.ruoyi.mgkf.domain.DoctorEducationalBackground;
import com.ruoyi.mgkf.service.IDoctorEducationalBackgroundService;

/**
 * 医师教育背景Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class DoctorEducationalBackgroundServiceImpl implements IDoctorEducationalBackgroundService 
{
    @Autowired
    private DoctorEducationalBackgroundMapper doctorEducationalBackgroundMapper;

    /**
     * 查询医师教育背景
     * 
     * @param id 医师教育背景主键
     * @return 医师教育背景
     */
    @Override
    public DoctorEducationalBackground selectDoctorEducationalBackgroundById(Long id)
    {
        return doctorEducationalBackgroundMapper.selectDoctorEducationalBackgroundById(id);
    }

    /**
     * 查询医师教育背景列表
     * 
     * @param doctorEducationalBackground 医师教育背景
     * @return 医师教育背景
     */
    @Override
    public List<DoctorEducationalBackground> selectDoctorEducationalBackgroundList(DoctorEducationalBackground doctorEducationalBackground)
    {
        return doctorEducationalBackgroundMapper.selectDoctorEducationalBackgroundList(doctorEducationalBackground);
    }

    /**
     * 新增医师教育背景
     * 
     * @param doctorEducationalBackground 医师教育背景
     * @return 结果
     */
    @Override
    public int insertDoctorEducationalBackground(DoctorEducationalBackground doctorEducationalBackground)
    {
        doctorEducationalBackground.setCreateTime(DateUtils.getNowDate());
        return doctorEducationalBackgroundMapper.insertDoctorEducationalBackground(doctorEducationalBackground);
    }

    /**
     * 修改医师教育背景
     * 
     * @param doctorEducationalBackground 医师教育背景
     * @return 结果
     */
    @Override
    public int updateDoctorEducationalBackground(DoctorEducationalBackground doctorEducationalBackground)
    {
        doctorEducationalBackground.setUpdateTime(DateUtils.getNowDate());
        return doctorEducationalBackgroundMapper.updateDoctorEducationalBackground(doctorEducationalBackground);
    }

    /**
     * 批量删除医师教育背景
     * 
     * @param ids 需要删除的医师教育背景主键
     * @return 结果
     */
    @Override
    public int deleteDoctorEducationalBackgroundByIds(Long[] ids)
    {
        return doctorEducationalBackgroundMapper.deleteDoctorEducationalBackgroundByIds(ids);
    }

    /**
     * 删除医师教育背景信息
     * 
     * @param id 医师教育背景主键
     * @return 结果
     */
    @Override
    public int deleteDoctorEducationalBackgroundById(Long id)
    {
        return doctorEducationalBackgroundMapper.deleteDoctorEducationalBackgroundById(id);
    }

    @Override
    public Map<Long, List<DoctorEducationalBackground>> selectMapByDoctorIdList(List<Long> doctorIdList) {
        DoctorEducationalBackground doctorEducationalBackground = new DoctorEducationalBackground();
        doctorEducationalBackground.setDoctorIdList(doctorIdList);
        doctorEducationalBackground.setDelFlag(PublicCommon.ENABLE);
        List<DoctorEducationalBackground> doctorEducationalBackgroundList =
            doctorEducationalBackgroundMapper.selectDoctorEducationalBackgroundList(doctorEducationalBackground);
        return CollectionUtil.isNotEmpty(doctorEducationalBackgroundList) ? doctorEducationalBackgroundList.stream().collect(Collectors.groupingBy(DoctorEducationalBackground::getDoctorId)) : new HashMap<>();
    }

    @Override
    public void handlerDoctorEducationalBackgroundList(List<DoctorEducationalBackground> doctorEducationalBackgroundList, List<String> handlerOperations) {
        if (CollectionUtil.isEmpty(doctorEducationalBackgroundList)) {
            return;
        }

        for (DoctorEducationalBackground doctorEducationalBackground : doctorEducationalBackgroundList) {
            if (handlerOperations.contains("lang")) {
                doctorEducationalBackground.setQualification(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, doctorEducationalBackground.getQualificationZh(),
                            LanguageConstant.EN, doctorEducationalBackground.getQualificationEn()
                        )
                    )
                );
            }
        }
    }

    @Override
    public void insertOrUpdateBatch(Long doctorId, List<DoctorEducationalBackground> doctorEducationalBackgroundList) {
        if (CollectionUtil.isEmpty(doctorEducationalBackgroundList)) {
            return;
        }
        List<DoctorEducationalBackground> insertDoctorEducationalBackgroundList = doctorEducationalBackgroundList.stream()
            .filter(x -> x.getId() == null)
            .peek(x -> {
                x.setDoctorId(doctorId);
                x.setCreateTime(DateUtils.getNowDate());
            })
            .toList();
        if (CollectionUtil.isNotEmpty(insertDoctorEducationalBackgroundList)) {
            doctorEducationalBackgroundMapper.insertBatch(insertDoctorEducationalBackgroundList);
        }
        List<DoctorEducationalBackground> updateDoctorEducationalBackgroundList = doctorEducationalBackgroundList.stream()
            .filter(x -> x.getId() != null)
            .peek(x -> x.setUpdateTime(DateUtils.getNowDate()))
            .toList();
        if (CollectionUtil.isNotEmpty(updateDoctorEducationalBackgroundList)) {
            doctorEducationalBackgroundMapper.updateBatchById(updateDoctorEducationalBackgroundList);
        }
    }

    @Override
    public void deleteByDoctorIds(Long[] dockerIds) {
        doctorEducationalBackgroundMapper.deleteByDoctorIds(dockerIds);
    }
}
