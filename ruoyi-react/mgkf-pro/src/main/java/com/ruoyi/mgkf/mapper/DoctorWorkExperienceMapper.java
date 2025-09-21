package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.DoctorWorkExperience;
import org.apache.ibatis.annotations.Param;

/**
 * 医师工作经历Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface DoctorWorkExperienceMapper 
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
     * 删除医师工作经历
     * 
     * @param id 医师工作经历主键
     * @return 结果
     */
    public int deleteDoctorWorkExperienceById(Long id);

    /**
     * 批量删除医师工作经历
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteDoctorWorkExperienceByIds(Long[] ids);

    void insertBatch(@Param("list") List<DoctorWorkExperience> doctorWorkExperienceList);

    void updateBatchById(@Param("list") List<DoctorWorkExperience> doctorWorkExperienceList);

    void deleteByDoctorIds(Long[] doctorIds);
}
