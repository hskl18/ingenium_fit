package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.RehabilitationCenter;

/**
 * 康复中心Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IRehabilitationCenterService 
{
    /**
     * 查询康复中心
     * 
     * @param id 康复中心主键
     * @return 康复中心
     */
    public RehabilitationCenter selectRehabilitationCenterById(Long id);

    /**
     * 查询康复中心列表
     * 
     * @param rehabilitationCenter 康复中心
     * @return 康复中心集合
     */
    public List<RehabilitationCenter> selectRehabilitationCenterList(RehabilitationCenter rehabilitationCenter);

    /**
     * 新增康复中心
     * 
     * @param rehabilitationCenter 康复中心
     * @return 结果
     */
    public int insertRehabilitationCenter(RehabilitationCenter rehabilitationCenter);

    /**
     * 修改康复中心
     * 
     * @param rehabilitationCenter 康复中心
     * @return 结果
     */
    public int updateRehabilitationCenter(RehabilitationCenter rehabilitationCenter);

    /**
     * 批量删除康复中心
     * 
     * @param ids 需要删除的康复中心主键集合
     * @return 结果
     */
    public int deleteRehabilitationCenterByIds(Long[] ids);

    /**
     * 删除康复中心信息
     * 
     * @param id 康复中心主键
     * @return 结果
     */
    public int deleteRehabilitationCenterById(Long id);

    /**
     * 处理康复中心查询结果
     */
    void handlerRehabilitationCenterList(List<RehabilitationCenter> rehabilitationCenterList, List<String> handlerOptions);

    /**
     * 计算康复中心星级
     */
    void computeStar(Long rehabilitationCenterId);

    /**
     * 修改康复中心评论数
     */
    void updateCommentNum(Long rehabilitationCenterId, Integer commentNum);

    Map<Long, RehabilitationCenter> selectMapByIds(List<Long> rehabilitationCenterIdList);

    NumberStatisticsVo numberStatistics();
}
