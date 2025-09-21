package com.ruoyi.mgkf.service.impl;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.core.domain.BaseEntity;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.mgkf.domain.*;
import com.ruoyi.mgkf.service.*;
import com.ruoyi.system.util.LanguageUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.DoctorMapper;

/**
 * 医师Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class DoctorServiceImpl implements IDoctorService 
{
    @Autowired
    private DoctorMapper doctorMapper;

    @Resource
    private IUserCommentService userCommentService;

    @Resource
    private IDoctorWorkExperienceService doctorWorkExperienceService;

    @Resource
    private IDoctorEducationalBackgroundService doctorEducationalBackgroundService;

    @Resource
    private IRehabilitationCenterService rehabilitationCenterService;

    /**
     * 查询医师
     * 
     * @param id 医师主键
     * @return 医师
     */
    @Override
    public Doctor selectDoctorById(Long id)
    {
        return doctorMapper.selectDoctorById(id);
    }

    /**
     * 查询医师列表
     * 
     * @param doctor 医师
     * @return 医师
     */
    @Override
    public List<Doctor> selectDoctorList(Doctor doctor)
    {
        return doctorMapper.selectDoctorList(doctor);
    }

    /**
     * 新增医师
     * 
     * @param doctor 医师
     * @return 结果
     */
    @Override
    public int insertDoctor(Doctor doctor)
    {
        doctor.setCreateTime(DateUtils.getNowDate());
        return doctorMapper.insertDoctor(doctor);
    }

    /**
     * 修改医师
     * 
     * @param doctor 医师
     * @return 结果
     */
    @Override
    public int updateDoctor(Doctor doctor)
    {
        doctor.setUpdateTime(DateUtils.getNowDate());
        return doctorMapper.updateDoctor(doctor);
    }

    /**
     * 批量删除医师
     * 
     * @param ids 需要删除的医师主键
     * @return 结果
     */
    @Override
    public int deleteDoctorByIds(Long[] ids)
    {
        return doctorMapper.deleteDoctorByIds(ids);
    }

    /**
     * 删除医师信息
     * 
     * @param id 医师主键
     * @return 结果
     */
    @Override
    public int deleteDoctorById(Long id)
    {
        return doctorMapper.deleteDoctorById(id);
    }

    /**
     * 修改医师评价数量
     */
    @Override
    public void updateCommentNum(Long doctorId, Integer commentNum) {
        doctorMapper.updateCommentNum(doctorId, commentNum);
    }

    /**
     * 计算星级
     */
    @Override
    public void computeStar(Long doctorId) {
        Double computeStar = userCommentService.computeStar(doctorId, 4L);
        if (computeStar == null) {
            return;
        }
        Doctor doctor = new Doctor();
        doctor.setStar(computeStar);
        doctor.setId(doctorId);
        doctorMapper.updateDoctor(doctor);
    }

    /**
     * 处理医师列表结果
     */
    @Override
    public void handlerDoctorList(List<Doctor> doctorList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(doctorList)) {
            return;
        }

        List<Long> doctorIdList = doctorList.stream().map(Doctor::getId).toList();
        List<Long> rehabilitationCenterIdList = doctorList.stream().map(Doctor::getRehabilitationCenterId).toList();

        Map<Long, List<DoctorWorkExperience>> doctorWorkExperienceMap = new HashMap<>();
        Map<Long, List<DoctorEducationalBackground>> doctorEducationalBackgroundMap = new HashMap<>();
        Map<Long, RehabilitationCenter> rehabilitationCenterMap = new HashMap<>();

        if (handlerOptions.contains("selectEducationalBackground")) {
            doctorEducationalBackgroundMap = doctorEducationalBackgroundService.selectMapByDoctorIdList(doctorIdList);
            doctorEducationalBackgroundService.handlerDoctorEducationalBackgroundList(
                doctorEducationalBackgroundMap.values().stream().flatMap(List::stream).toList(),
                List.of("lang")
            );
        }

        if (handlerOptions.contains("selectWorkExperience")) {
            doctorWorkExperienceMap = doctorWorkExperienceService.selectMapByDoctorIdList(doctorIdList);
            doctorWorkExperienceService.handlerDoctorWorkExperienceList(
                doctorWorkExperienceMap.values().stream().flatMap(List::stream).toList(),
                List.of("lang")
            );
        }

        if (handlerOptions.contains("selectRehabilitationCenter")) {
            rehabilitationCenterMap = rehabilitationCenterService.selectMapByIds(rehabilitationCenterIdList);
        }

        for (Doctor doctor : doctorList) {
            Long doctorId = doctor.getId();

            if (handlerOptions.contains("selectEducationalBackground")) {
                List<DoctorEducationalBackground> doctorEducationalBackgroundList = doctorEducationalBackgroundMap.get(doctorId);
                if (CollectionUtil.isNotEmpty(doctorEducationalBackgroundList)) {
                    doctor.setDoctorEducationalBackgroundList(
                        doctorEducationalBackgroundList.stream().sorted(Comparator.comparing(BaseEntity::getCreateTime).reversed()).toList()
                    );
                }
            }

            if (handlerOptions.contains("selectWorkExperience")) {
                List<DoctorWorkExperience> doctorWorkExperienceList = doctorWorkExperienceMap.get(doctorId);
                if (CollectionUtil.isNotEmpty(doctorWorkExperienceList)) {
                    doctor.setDoctorWorkExperienceList(
                        doctorWorkExperienceList.stream().sorted(Comparator.comparing(BaseEntity::getCreateTime).reversed()).toList()
                    );
                }
            }

            if (handlerOptions.contains("selectRehabilitationCenter")) {
                doctor.setRehabilitationCenter(rehabilitationCenterMap.get(doctor.getRehabilitationCenterId()));
            }

            if (handlerOptions.contains("lang")) {
                doctor.setName(
                    LanguageUtil.getResponseByLanguage(
                        new HashMap<>() {{
                            put(LanguageConstant.ZH, doctor.getNameZh());
                            put(LanguageConstant.EN, doctor.getNameEn());
                        }}
                    )
                );
                doctor.setTags(
                    LanguageUtil.getResponseByLanguage(
                        new HashMap<>() {{
                            put(LanguageConstant.ZH, doctor.getTagsZh());
                            put(LanguageConstant.EN, doctor.getTagsEn());
                        }}
                    )
                );
                doctor.setPositionRange(
                    LanguageUtil.getResponseByLanguage(
                        new HashMap<>() {{
                            put(LanguageConstant.ZH, doctor.getPositionRangeZh());
                            put(LanguageConstant.EN, doctor.getPositionRangeEn());
                        }}
                    )
                );
                doctor.setPositionTitle(
                    LanguageUtil.getResponseByLanguage(
                        new HashMap<>() {{
                            put(LanguageConstant.ZH, doctor.getPositionTitleZh());
                            put(LanguageConstant.EN, doctor.getPositionTitleEn());
                        }}
                    )
                );
            }
        }
    }
}
