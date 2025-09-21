package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.controller.vo.RankingListStatisticsVo;
import com.ruoyi.mgkf.domain.DynamicsPost;

/**
 * 动态帖子Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IDynamicsPostService 
{
    /**
     * 查询动态帖子
     * 
     * @param id 动态帖子主键
     * @return 动态帖子
     */
    public DynamicsPost selectDynamicsPostById(Long id);

    /**
     * 查询动态帖子列表
     * 
     * @param dynamicsPost 动态帖子
     * @return 动态帖子集合
     */
    public List<DynamicsPost> selectDynamicsPostList(DynamicsPost dynamicsPost);

    /**
     * 新增动态帖子
     * 
     * @param dynamicsPost 动态帖子
     * @return 结果
     */
    public int insertDynamicsPost(DynamicsPost dynamicsPost);

    /**
     * 修改动态帖子
     * 
     * @param dynamicsPost 动态帖子
     * @return 结果
     */
    public int updateDynamicsPost(DynamicsPost dynamicsPost);

    /**
     * 批量删除动态帖子
     * 
     * @param ids 需要删除的动态帖子主键集合
     * @return 结果
     */
    public int deleteDynamicsPostByIds(Long[] ids);

    /**
     * 删除动态帖子信息
     * 
     * @param id 动态帖子主键
     * @return 结果
     */
    public int deleteDynamicsPostById(Long id);

    /**
     * 处理动态帖子查询结果
     */
    void handlerDynamicsPostList(List<DynamicsPost> dynamicsPostList, List<String> handlerOptions);

    /**
     * 修改转发数量
     */
    void updateForwardNum(Long dynamicsPostId, Long forwardNum);

    /**
     * 查询时间分组列表
     */
    List<DynamicsPost> selectDynamicsPostTimeGroupList(DynamicsPost dynamicsPost);

    NumberStatisticsVo numberStatistics();

    Map<Long, DynamicsPost> selectMapByIdList(List<Long> dynamicsPostIdList);

    /**
     * 修改动态帖子评论数量
     */
    void updateCommentNum(Long dynamicsPostId, Integer commentNum);

    List<RankingListStatisticsVo> rankingListModelStatistics();
}
