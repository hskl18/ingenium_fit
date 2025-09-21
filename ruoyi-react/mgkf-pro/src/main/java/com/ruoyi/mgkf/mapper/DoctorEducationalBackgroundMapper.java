package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.DoctorEducationalBackground;
import org.apache.ibatis.annotations.Param;

/**
 * 医师教育背景Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface DoctorEducationalBackgroundMapper 
{
    /**
     * 查询医师教育背景
     * 
     * @param id 医师教育背景主键
     * @return 医师教育背景
     */
    public DoctorEducationalBackground selectDoctorEducationalBackgroundById(Long id);

    /**
     * 查询医师教育背景列表
     * 
     * @param doctorEducationalBackground 医师教育背景
     * @return 医师教育背景集合
     */
    public List<DoctorEducationalBackground> selectDoctorEducationalBackgroundList(DoctorEducationalBackground doctorEducationalBackground);

    /**
     * 新增医师教育背景
     * 
     * @param doctorEducationalBackground 医师教育背景
     * @return 结果
     */
    public int insertDoctorEducationalBackground(DoctorEducationalBackground doctorEducationalBackground);

    /**
     * 修改医师教育背景
     * 
     * @param doctorEducationalBackground 医师教育背景
     * @return 结果
     */
    public int updateDoctorEducationalBackground(DoctorEducationalBackground doctorEducationalBackground);

    /**
     * 删除医师教育背景
     * 
     * @param id 医师教育背景主键
     * @return 结果
     */
    public int deleteDoctorEducationalBackgroundById(Long id);

    /**
     * 批量删除医师教育背景
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteDoctorEducationalBackgroundByIds(Long[] ids);

    void insertBatch(@Param("list") List<DoctorEducationalBackground> doctorEducationalBackgroundList);

    void updateBatchById(@Param("list") List<DoctorEducationalBackground> doctorEducationalBackgroundList);

    void deleteByDoctorIds(Long[] dockerIds);
}
