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
import com.ruoyi.mgkf.mapper.DoctorWorkExperienceMapper;
import com.ruoyi.mgkf.domain.DoctorWorkExperience;
import com.ruoyi.mgkf.service.IDoctorWorkExperienceService;

/**
 * 医师工作经历Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class DoctorWorkExperienceServiceImpl implements IDoctorWorkExperienceService 
{
    @Autowired
    private DoctorWorkExperienceMapper doctorWorkExperienceMapper;

    /**
     * 查询医师工作经历
     * 
     * @param id 医师工作经历主键
     * @return 医师工作经历
     */
    @Override
    public DoctorWorkExperience selectDoctorWorkExperienceById(Long id)
    {
        return doctorWorkExperienceMapper.selectDoctorWorkExperienceById(id);
    }

    /**
     * 查询医师工作经历列表
     * 
     * @param doctorWorkExperience 医师工作经历
     * @return 医师工作经历
     */
    @Override
    public List<DoctorWorkExperience> selectDoctorWorkExperienceList(DoctorWorkExperience doctorWorkExperience)
    {
        return doctorWorkExperienceMapper.selectDoctorWorkExperienceList(doctorWorkExperience);
    }

    /**
     * 新增医师工作经历
     * 
     * @param doctorWorkExperience 医师工作经历
     * @return 结果
     */
    @Override
    public int insertDoctorWorkExperience(DoctorWorkExperience doctorWorkExperience)
    {
        doctorWorkExperience.setCreateTime(DateUtils.getNowDate());
        return doctorWorkExperienceMapper.insertDoctorWorkExperience(doctorWorkExperience);
    }

    /**
     * 修改医师工作经历
     * 
     * @param doctorWorkExperience 医师工作经历
     * @return 结果
     */
    @Override
    public int updateDoctorWorkExperience(DoctorWorkExperience doctorWorkExperience)
    {
        doctorWorkExperience.setUpdateTime(DateUtils.getNowDate());
        return doctorWorkExperienceMapper.updateDoctorWorkExperience(doctorWorkExperience);
    }

    /**
     * 批量删除医师工作经历
     * 
     * @param ids 需要删除的医师工作经历主键
     * @return 结果
     */
    @Override
    public int deleteDoctorWorkExperienceByIds(Long[] ids)
    {
        return doctorWorkExperienceMapper.deleteDoctorWorkExperienceByIds(ids);
    }

    /**
     * 删除医师工作经历信息
     * 
     * @param id 医师工作经历主键
     * @return 结果
     */
    @Override
    public int deleteDoctorWorkExperienceById(Long id)
    {
        return doctorWorkExperienceMapper.deleteDoctorWorkExperienceById(id);
    }

    @Override
    public Map<Long, List<DoctorWorkExperience>> selectMapByDoctorIdList(List<Long> doctorIdList) {
        DoctorWorkExperience doctorWorkExperience = new DoctorWorkExperience();
        doctorWorkExperience.setDoctorIdList(doctorIdList);
        doctorWorkExperience.setDelFlag(PublicCommon.ENABLE);
        List<DoctorWorkExperience> doctorWorkExperienceList = doctorWorkExperienceMapper.selectDoctorWorkExperienceList(doctorWorkExperience);
        return CollectionUtil.isNotEmpty(doctorWorkExperienceList) ? doctorWorkExperienceList.stream().collect(Collectors.groupingBy(DoctorWorkExperience::getDoctorId)) : new HashMap<>();
    }

    @Override
    public void handlerDoctorWorkExperienceList(List<DoctorWorkExperience> doctorWorkExperienceList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(doctorWorkExperienceList)) {
            return;
        }

        for (DoctorWorkExperience doctorWorkExperience : doctorWorkExperienceList) {
            if (handlerOptions.contains("lang")) {
                doctorWorkExperience.setPosition(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, doctorWorkExperience.getPositionZh(),
                            LanguageConstant.EN, doctorWorkExperience.getPositionEn()
                        )
                    )
                );
                doctorWorkExperience.setContent(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, doctorWorkExperience.getContentZh(),
                            LanguageConstant.EN, doctorWorkExperience.getContentEn()
                        )
                    )
                );
            }
        }
    }

    @Override
    public void insertOrUpdateBatch(Long doctorId, List<DoctorWorkExperience> doctorWorkExperienceList) {
        if (CollectionUtil.isEmpty(doctorWorkExperienceList)) {
            return;
        }

        List<DoctorWorkExperience> insertDoctorWorkExperienceList = doctorWorkExperienceList.stream()
            .filter(x -> x.getId() == null)
            .peek(x -> {
                x.setDoctorId(doctorId);
                x.setCreateTime(DateUtils.getNowDate());
            })
            .toList();
        if (CollectionUtil.isNotEmpty(insertDoctorWorkExperienceList)) {
            doctorWorkExperienceMapper.insertBatch(insertDoctorWorkExperienceList);
        }

        List<DoctorWorkExperience> updateDoctorWorkExperienceList = doctorWorkExperienceList.stream()
            .filter(x -> x.getId() != null)
            .peek(x -> x.setUpdateTime(DateUtils.getNowDate()))
            .toList();
        if (CollectionUtil.isNotEmpty(updateDoctorWorkExperienceList)) {
            doctorWorkExperienceMapper.updateBatchById(updateDoctorWorkExperienceList);
        }
    }

    @Override
    public void deleteByDoctorIds(Long[] doctorIds) {
        doctorWorkExperienceMapper.deleteByDoctorIds(doctorIds);
    }
}
