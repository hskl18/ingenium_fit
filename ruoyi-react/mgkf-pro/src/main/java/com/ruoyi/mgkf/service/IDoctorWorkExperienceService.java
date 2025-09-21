package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.domain.DoctorWorkExperience;

/**
 * 医师工作经历Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IDoctorWorkExperienceService 
{
    /**
     * 查询医师工作经历
     * 
     * @param id 医师工作经历主键
     * @return 医师工作经历
     */
    public DoctorWorkExperience selectDoctorWorkExperienceById(Long id);

    /**
     * 查询医师工作经历列表
     * 
     * @param doctorWorkExperience 医师工作经历
     * @return 医师工作经历集合
     */
    public List<DoctorWorkExperience> selectDoctorWorkExperienceList(DoctorWorkExperience doctorWorkExperience);

    /**
     * 新增医师工作经历
     * 
     * @param doctorWorkExperience 医师工作经历
     * @return 结果
     */
    public int insertDoctorWorkExperience(DoctorWorkExperience doctorWorkExperience);

    /**
     * 修改医师工作经历
     * 
     * @param doctorWorkExperience 医师工作经历
     * @return 结果
     */
    public int updateDoctorWorkExperience(DoctorWorkExperience doctorWorkExperience);

    /**
     * 批量删除医师工作经历
     * 
     * @param ids 需要删除的医师工作经历主键集合
     * @return 结果
     */
    public int deleteDoctorWorkExperienceByIds(Long[] ids);

    /**
     * 删除医师工作经历信息
     * 
     * @param id 医师工作经历主键
     * @return 结果
     */
    public int deleteDoctorWorkExperienceById(Long id);

    Map<Long, List<DoctorWorkExperience>> selectMapByDoctorIdList(List<Long> doctorIdList);

    void handlerDoctorWorkExperienceList(List<DoctorWorkExperience> doctorWorkExperienceList, List<String> handlerOptions);

    void insertOrUpdateBatch(Long doctorId, List<DoctorWorkExperience> doctorWorkExperienceList);

    void deleteByDoctorIds(Long[] doctorIds);
}
