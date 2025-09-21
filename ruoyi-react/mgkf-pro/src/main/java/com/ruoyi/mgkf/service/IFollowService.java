package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.Follow;
import com.ruoyi.mgkf.domain.User;

/**
 * 关注Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IFollowService 
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
     * 批量删除关注
     * 
     * @param ids 需要删除的关注主键集合
     * @return 结果
     */
    public int deleteFollowByIds(Long[] ids);

    /**
     * 删除关注信息
     * 
     * @param id 关注主键
     * @return 结果
     */
    public int deleteFollowById(Long id);

    /**
     * 新增/取消关注
     */
    void addFollow(Follow.FollowBo bo);

    /**
     * 获取用户关注用户id列表
     */
    List<Long> selectFollowUserIdList(Long userId);

    /**
     * 获取关注当前用户的用户id列表
     */
    List<Long> selectByFollowUserIdList(Long userId);

    /**
     * 查询用户关注数
     */
    Long selectFollowingNum(Long userId);

    /**
     * 查询用户粉丝数
     */
    Long selectFollowersNum(Long userId);

    void handlerFollowList(List<Follow> followList, List<String> handlerOptions);

    NumberStatisticsVo numberStatistics();


}
