package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.RehabilitationCenter;
import org.apache.ibatis.annotations.Param;

/**
 * 康复中心Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface RehabilitationCenterMapper 
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
     * 删除康复中心
     * 
     * @param id 康复中心主键
     * @return 结果
     */
    public int deleteRehabilitationCenterById(Long id);

    /**
     * 批量删除康复中心
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteRehabilitationCenterByIds(Long[] ids);

    /**
     * 修改康复中心评论数
     */
    void updateCommentNum(@Param("rehabilitationCenterId") Long rehabilitationCenterId, @Param("commentNum") Integer commentNum);

    Long selectCount();
}
