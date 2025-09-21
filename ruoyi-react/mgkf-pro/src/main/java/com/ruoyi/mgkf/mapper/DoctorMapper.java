package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.Doctor;
import org.apache.ibatis.annotations.Param;

/**
 * 医师Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface DoctorMapper 
{
    /**
     * 查询医师
     * 
     * @param id 医师主键
     * @return 医师
     */
    public Doctor selectDoctorById(Long id);

    /**
     * 查询医师列表
     * 
     * @param doctor 医师
     * @return 医师集合
     */
    public List<Doctor> selectDoctorList(Doctor doctor);

    /**
     * 新增医师
     * 
     * @param doctor 医师
     * @return 结果
     */
    public int insertDoctor(Doctor doctor);

    /**
     * 修改医师
     * 
     * @param doctor 医师
     * @return 结果
     */
    public int updateDoctor(Doctor doctor);

    /**
     * 删除医师
     * 
     * @param id 医师主键
     * @return 结果
     */
    public int deleteDoctorById(Long id);

    /**
     * 批量删除医师
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteDoctorByIds(Long[] ids);

    /**
     * 修改医师评价数量
     */
    void updateCommentNum(@Param("doctorId") Long doctorId, @Param("commentNum") Integer commentNum);
}
