package com.ruoyi.mgkf.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.convert.Convert;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.controller.vo.RankingListStatisticsVo;
import com.ruoyi.mgkf.domain.DynamicsPost;
import com.ruoyi.mgkf.domain.Follow;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.mapper.DynamicsPostMapper;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.GiveLikeMapper;
import com.ruoyi.mgkf.domain.GiveLike;
import com.ruoyi.mgkf.service.IGiveLikeService;

/**
 * 点赞Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class GiveLikeServiceImpl implements IGiveLikeService 
{
    @Autowired
    private GiveLikeMapper giveLikeMapper;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private DynamicsPostMapper dynamicsPostMapper;

    @Resource
    private IUserService userService;

    /**
     * 查询点赞
     * 
     * @param id 点赞主键
     * @return 点赞
     */
    @Override
    public GiveLike selectGiveLikeById(Long id)
    {
        return giveLikeMapper.selectGiveLikeById(id);
    }

    /**
     * 查询点赞列表
     * 
     * @param giveLike 点赞
     * @return 点赞
     */
    @Override
    public List<GiveLike> selectGiveLikeList(GiveLike giveLike)
    {
        return giveLikeMapper.selectGiveLikeList(giveLike);
    }

    /**
     * 新增点赞
     * 
     * @param giveLike 点赞
     * @return 结果
     */
    @Override
    public int insertGiveLike(GiveLike giveLike)
    {
        giveLike.setCreateTime(DateUtils.getNowDate());
        return giveLikeMapper.insertGiveLike(giveLike);
    }

    /**
     * 修改点赞
     * 
     * @param giveLike 点赞
     * @return 结果
     */
    @Override
    public int updateGiveLike(GiveLike giveLike)
    {
        giveLike.setUpdateTime(DateUtils.getNowDate());
        return giveLikeMapper.updateGiveLike(giveLike);
    }

    /**
     * 批量删除点赞
     * 
     * @param ids 需要删除的点赞主键
     * @return 结果
     */
    @Override
    public int deleteGiveLikeByIds(Long[] ids)
    {
        return giveLikeMapper.deleteGiveLikeByIds(ids);
    }

    /**
     * 删除点赞信息
     * 
     * @param id 点赞主键
     * @return 结果
     */
    @Override
    public int deleteGiveLikeById(Long id)
    {
        return giveLikeMapper.deleteGiveLikeById(id);
    }

    @Override
    public Map<Long, GiveLike> selectMapByObjectIdAndTypeAndUserId(List<Long> dynamicsPostIdList, Long type, Long userId) {
        GiveLike giveLike = new GiveLike();
        giveLike.setObjectIdList(dynamicsPostIdList);
        giveLike.setObjectType(type);
        giveLike.setUserId(userId);
        giveLike.setDelFlag(PublicCommon.ENABLE);
        List<GiveLike> giveLikeList = giveLikeMapper.selectGiveLikeList(giveLike);
        if (CollectionUtil.isNotEmpty(giveLikeList)) {
            return giveLikeList.stream().collect(Collectors.toMap(GiveLike::getObjectId, s -> s));
        }
        return new HashMap<>();
    }

    /**
     * 点赞/取消点赞
     */
    @Override
    public void addGiveLike(GiveLike.GiveLikeBo bo) {
        GiveLike giveLike = new GiveLike();
        giveLike.setObjectId(bo.getObjectId());
        giveLike.setObjectType(bo.getObjectType());
        giveLike.setUserId(businessUtil.getLoginUser().getId());
        giveLike.setCreateTime(DateUtils.getNowDate());
        giveLike.setUpdateTime(DateUtils.getNowDate());
        giveLikeMapper.addGiveLike(giveLike);

        giveLike.setCreateTime(null);
        giveLike.setUpdateTime(null);
        List<GiveLike> giveLikeList = giveLikeMapper.selectGiveLikeList(giveLike);
        if (CollectionUtil.isNotEmpty(giveLikeList)) {
            GiveLike first = giveLikeList.get(0);
            boolean whetherGiveLike = Objects.equals(first.getDelFlag(), PublicCommon.ENABLE);
            // 1-点赞帖子
            if (first.getObjectType() == 1) {
                dynamicsPostMapper.updateDynamicsPostLikesNum(bo.getObjectId(), whetherGiveLike ? 1 : -1);
            }
        }
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        GiveLike giveLike = new GiveLike();
        giveLike.setCreateStartTime(yesterdayRange[0]);
        giveLike.setCreateEndTime(todayRange[1]);
        List<GiveLike> giveLikeList = giveLikeMapper.selectGiveLikeList(giveLike);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(giveLikeMapper.selectCount());
        if (CollUtil.isNotEmpty(giveLikeList)) {
            vo.setTodayNumber(
                giveLikeList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                giveLikeList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }

    @Override
    public List<RankingListStatisticsVo> rankingListModelStatistics() {
        List<GiveLike> giveLikeList = giveLikeMapper.selectGiveLikeRanking();
        if (CollectionUtil.isEmpty(giveLikeList)) {
            return new ArrayList<>();
        }
        List<Long> userIdList = giveLikeList.stream().map(GiveLike::getUserId).toList();
        Map<Long, User> userMap = userService.selectMapByIds(userIdList);
        return giveLikeList.stream().map(x -> {
            RankingListStatisticsVo vo = new RankingListStatisticsVo();
            vo.setRankingResult(Convert.convert(String.class, x.getGiveLikeNum(), "0"));
            if (userMap.containsKey(x.getUserId())) {
                vo.setRankingObject(userMap.get(x.getUserId()).getNickName());
            }
            return vo;
        }).toList();
    }
}
