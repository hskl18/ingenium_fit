package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.Follow;

/**
 * 关注Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface FollowMapper 
{
    /**
     * 查询关注
     * 
     * @param id 关注主键
     * @return 关注
     */
    public Follow selectFollowById(Long id);

    /**
     * 查询关注列表
     * 
     * @param follow 关注
     * @return 关注集合
     */
    public List<Follow> selectFollowList(Follow follow);

    /**
     * 新增关注
     * 
     * @param follow 关注
     * @return 结果
     */
    public int insertFollow(Follow follow);

    /**
     * 修改关注
     * 
     * @param follow 关注
     * @return 结果
     */
    public int updateFollow(Follow follow);

    /**
     * 删除关注
     * 
     * @param id 关注主键
     * @return 结果
     */
    public int deleteFollowById(Long id);

    /**
     * 批量删除关注
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteFollowByIds(Long[] ids);

    /**
     * 新增/取消关注
     */
    void addFollow(Follow follow);

    /**
     * 查询用户关注数
     */
    Long selectFollowingNum(Long userId);

    /**
     * 查询用户粉丝数
     */
    Long selectFollowersNum(Long userId);

    Long selectCount();
}
