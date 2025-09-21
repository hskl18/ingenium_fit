package com.ruoyi.mgkf.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.FollowMapper;
import com.ruoyi.mgkf.domain.Follow;
import com.ruoyi.mgkf.service.IFollowService;

/**
 * 关注Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class FollowServiceImpl implements IFollowService 
{
    @Autowired
    private FollowMapper followMapper;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IUserService userService;

    /**
     * 查询关注
     * 
     * @param id 关注主键
     * @return 关注
     */
    @Override
    public Follow selectFollowById(Long id)
    {
        return followMapper.selectFollowById(id);
    }

    /**
     * 查询关注列表
     * 
     * @param follow 关注
     * @return 关注
     */
    @Override
    public List<Follow> selectFollowList(Follow follow)
    {
        return followMapper.selectFollowList(follow);
    }

    /**
     * 新增关注
     * 
     * @param follow 关注
     * @return 结果
     */
    @Override
    public int insertFollow(Follow follow)
    {
        follow.setCreateTime(DateUtils.getNowDate());
        return followMapper.insertFollow(follow);
    }

    /**
     * 修改关注
     * 
     * @param follow 关注
     * @return 结果
     */
    @Override
    public int updateFollow(Follow follow)
    {
        follow.setUpdateTime(DateUtils.getNowDate());
        return followMapper.updateFollow(follow);
    }

    /**
     * 批量删除关注
     * 
     * @param ids 需要删除的关注主键
     * @return 结果
     */
    @Override
    public int deleteFollowByIds(Long[] ids)
    {
        return followMapper.deleteFollowByIds(ids);
    }

    /**
     * 删除关注信息
     * 
     * @param id 关注主键
     * @return 结果
     */
    @Override
    public int deleteFollowById(Long id)
    {
        return followMapper.deleteFollowById(id);
    }

    /**
     * 新增/取消关注
     */
    @Override
    public void addFollow(Follow.FollowBo bo) {
        Follow follow = new Follow();
        follow.setFollowUserId(bo.getFollowUserId());
        follow.setUserId(businessUtil.getLoginUser().getId());
        follow.setCreateTime(DateUtils.getNowDate());
        follow.setUpdateTime(DateUtils.getNowDate());
        followMapper.addFollow(follow);
    }

    /**
     * 获取用户关注用户id列表
     */
    @Override
    public List<Long> selectFollowUserIdList(Long userId) {
        Follow follow = new Follow();
        follow.setUserId(userId);
        follow.setDelFlag(PublicCommon.ENABLE);
        List<Follow> followList = selectFollowList(follow);
        return CollectionUtil.isNotEmpty(followList) ? followList.stream().map(Follow::getFollowUserId).toList() : new ArrayList<>();
    }

    /**
     * 获取关注当前用户的用户id列表
     */
    @Override
    public List<Long> selectByFollowUserIdList(Long userId) {
        Follow follow = new Follow();
        follow.setFollowUserId(userId);
        follow.setDelFlag(PublicCommon.ENABLE);
        List<Follow> followList = selectFollowList(follow);
        return CollectionUtil.isNotEmpty(followList) ? followList.stream().map(Follow::getUserId).toList() : new ArrayList<>();
    }

    /**
     * 查询用户关注数
     */
    @Override
    public Long selectFollowingNum(Long userId) {
        return followMapper.selectFollowingNum(userId);
    }

    /**
     * 查询用户粉丝数
     */
    @Override
    public Long selectFollowersNum(Long userId) {
        return followMapper.selectFollowersNum(userId);
    }

    @Override
    public void handlerFollowList(List<Follow> followList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(followList)) {
            return;
        }

        Long loginUserId = businessUtil.getLoginUser().getId();

        Map<Long, User> fansUserMap = new HashMap<>();
        Map<Long, User> followUserMap = new HashMap<>();
        Map<Long, Follow> mutualFollowMap = new HashMap<>();

        if (handlerOptions.contains("selectFansUserInfo")) {
            List<Long> userIdList = followList.stream().map(Follow::getUserId).toList();
            fansUserMap = userService.selectMapByIds(userIdList);
            // 此时查询的是粉丝列表, 要查询是否相互关注, 需要查询当前我有没有关注我的粉丝
            if (handlerOptions.contains("mutualFollow")) {
                Follow follow = new Follow();
                follow.setFollowUserIdList(userIdList);
                follow.setUserId(loginUserId);
                follow.setDelFlag(PublicCommon.ENABLE);
                List<Follow> mutualFollowList = followMapper.selectFollowList(follow);
                if (CollectionUtil.isNotEmpty(mutualFollowList)) {
                    mutualFollowMap = mutualFollowList.stream().collect(Collectors.toMap(Follow::getFollowUserId, s -> s));
                }
            }
        }

        if (handlerOptions.contains("selectFollowUserInfo")) {
            List<Long> userIdList = followList.stream().map(Follow::getFollowUserId).toList();
            followUserMap = userService.selectMapByIds(userIdList);
            // 此时查询的是关注列表, 要查询是否相互关注, 需要查询当前我关注的用户有没有关注我
            if (handlerOptions.contains("mutualFollow")) {
                Follow follow = new Follow();
                follow.setFollowUserId(loginUserId);
                follow.setUserIdList(userIdList);
                follow.setDelFlag(PublicCommon.ENABLE);
                List<Follow> mutualFollowList = followMapper.selectFollowList(follow);
                if (CollectionUtil.isNotEmpty(mutualFollowList)) {
                    mutualFollowMap = mutualFollowList.stream().collect(Collectors.toMap(Follow::getUserId, s -> s));
                }
            }
        }

        for (Follow follow : followList) {
            if (handlerOptions.contains("selectFansUserInfo")) {
                follow.setUser(fansUserMap.get(follow.getUserId()));
                if (handlerOptions.contains("mutualFollow")) {
                    follow.setWhetherMutualFollow(mutualFollowMap.containsKey(follow.getUserId()));
                }
            }

            if (handlerOptions.contains("selectFollowUserInfo")) {
                follow.setUser(followUserMap.get(follow.getFollowUserId()));
                if (handlerOptions.contains("mutualFollow")) {
                    follow.setWhetherMutualFollow(mutualFollowMap.containsKey(follow.getFollowUserId()));
                }
            }
        }
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        Follow f = new Follow();
        f.setCreateStartTime(yesterdayRange[0]);
        f.setCreateEndTime(todayRange[1]);
        List<Follow> followList = followMapper.selectFollowList(f);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(followMapper.selectCount());
        if (CollUtil.isNotEmpty(followList)) {
            vo.setTodayNumber(
                followList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                followList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }
}
