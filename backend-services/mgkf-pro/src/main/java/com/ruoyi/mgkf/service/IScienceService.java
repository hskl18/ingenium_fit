package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.Science;

/**
 * 科普Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IScienceService 
{
    /**
     * 查询科普
     * 
     * @param id 科普主键
     * @return 科普
     */
    public Science selectScienceById(Long id);

    /**
     * 查询科普列表
     * 
     * @param science 科普
     * @return 科普集合
     */
    public List<Science> selectScienceList(Science science);

    /**
     * 新增科普
     * 
     * @param science 科普
     * @return 结果
     */
    public int insertScience(Science science);

    /**
     * 修改科普
     * 
     * @param science 科普
     * @return 结果
     */
    public int updateScience(Science science);

    /**
     * 批量删除科普
     * 
     * @param ids 需要删除的科普主键集合
     * @return 结果
     */
    public int deleteScienceByIds(Long[] ids);

    /**
     * 删除科普信息
     * 
     * @param id 科普主键
     * @return 结果
     */
    public int deleteScienceById(Long id);

    /**
     * 处理科普查询结果
     */
    void handlerScienceList(List<Science> scienceList, List<String> handlerOptions);

    NumberStatisticsVo numberStatistics();

    Map<Long, Science> selectMapByIdList(List<Long> scienceIdList);

    /**
     * 修改科普评论数量
     */
    void updateCommentNum(Long scienceId, Integer commentNum);
}
