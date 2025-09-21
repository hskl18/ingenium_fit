package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.DynamicsPost;
import org.apache.ibatis.annotations.Param;

/**
 * 动态帖子Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface DynamicsPostMapper 
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
     * 删除动态帖子
     * 
     * @param id 动态帖子主键
     * @return 结果
     */
    public int deleteDynamicsPostById(Long id);

    /**
     * 批量删除动态帖子
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteDynamicsPostByIds(Long[] ids);

    /**
     * 修改动态帖子点赞数
     */
    void updateDynamicsPostLikesNum(@Param("dynamicsPostId") Long dynamicsPostId, @Param("likesNum") Integer likesNum);

    /**
     * 修改转发数量
     */
    void updateForwardNum(@Param("dynamicsPostId") Long dynamicsPostId, @Param("forwardNum") Long forwardNum);

    /**
     * 查询时间分组列表
     */
    List<DynamicsPost> selectDynamicsPostTimeGroupList(DynamicsPost dynamicsPost);

    List<DynamicsPost> selectDynamicsPostByIds(@Param("dynamicsPostIds") List<Long> dynamicsPostIds);

    Long selectCount();

    /**
     * 修改动态帖子评论数量
     */
    void updateCommentNum(@Param("dynamicsPostId") Long dynamicsPostId, @Param("commentNum") Integer commentNum);

    List<DynamicsPost> selectPublishRanking();
}
