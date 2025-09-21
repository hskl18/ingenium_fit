package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.GiveLike;

/**
 * 点赞Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface GiveLikeMapper 
{
    /**
     * 查询点赞
     * 
     * @param id 点赞主键
     * @return 点赞
     */
    public GiveLike selectGiveLikeById(Long id);

    /**
     * 查询点赞列表
     * 
     * @param giveLike 点赞
     * @return 点赞集合
     */
    public List<GiveLike> selectGiveLikeList(GiveLike giveLike);

    /**
     * 新增点赞
     * 
     * @param giveLike 点赞
     * @return 结果
     */
    public int insertGiveLike(GiveLike giveLike);

    /**
     * 修改点赞
     * 
     * @param giveLike 点赞
     * @return 结果
     */
    public int updateGiveLike(GiveLike giveLike);

    /**
     * 删除点赞
     * 
     * @param id 点赞主键
     * @return 结果
     */
    public int deleteGiveLikeById(Long id);

    /**
     * 批量删除点赞
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteGiveLikeByIds(Long[] ids);

    /**
     * 点赞/取消点赞
     */
    void addGiveLike(GiveLike giveLike);

    Long selectCount();

    List<GiveLike> selectGiveLikeRanking();
}
