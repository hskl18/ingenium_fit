package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.domain.DoctorEducationalBackground;

/**
 * 医师教育背景Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IDoctorEducationalBackgroundService 
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
     * 批量删除医师教育背景
     * 
     * @param ids 需要删除的医师教育背景主键集合
     * @return 结果
     */
    public int deleteDoctorEducationalBackgroundByIds(Long[] ids);

    /**
     * 删除医师教育背景信息
     * 
     * @param id 医师教育背景主键
     * @return 结果
     */
    public int deleteDoctorEducationalBackgroundById(Long id);

    Map<Long, List<DoctorEducationalBackground>> selectMapByDoctorIdList(List<Long> doctorIdList);

    void handlerDoctorEducationalBackgroundList(List<DoctorEducationalBackground> doctorEducationalBackgroundList, List<String> handlerOperations);

    void insertOrUpdateBatch(Long doctorId, List<DoctorEducationalBackground> doctorEducationalBackgroundList);

    void deleteByDoctorIds(Long[] dockerIds);
}
