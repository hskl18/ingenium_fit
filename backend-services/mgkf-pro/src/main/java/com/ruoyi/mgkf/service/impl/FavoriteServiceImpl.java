package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.*;
import com.ruoyi.mgkf.service.IDynamicsPostService;
import com.ruoyi.mgkf.service.IRehabilitationCenterService;
import com.ruoyi.mgkf.service.IScienceService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.FavoriteMapper;
import com.ruoyi.mgkf.service.IFavoriteService;

/**
 * 收藏Service业务层处理
 *
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class FavoriteServiceImpl implements IFavoriteService {
    @Autowired
    private FavoriteMapper favoriteMapper;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    @Lazy
    private IRehabilitationCenterService rehabilitationCenterService;

    @Resource
    @Lazy
    private IDynamicsPostService dynamicsPostService;

    @Resource
    @Lazy
    private IScienceService scienceService;

    /**
     * 查询收藏
     *
     * @param id 收藏主键
     * @return 收藏
     */
    @Override
    public Favorite selectFavoriteById(Long id) {
        return favoriteMapper.selectFavoriteById(id);
    }

    /**
     * 查询收藏列表
     *
     * @param favorite 收藏
     * @return 收藏
     */
    @Override
    public List<Favorite> selectFavoriteList(Favorite favorite) {
        return favoriteMapper.selectFavoriteList(favorite);
    }

    /**
     * 新增收藏
     *
     * @param favorite 收藏
     * @return 结果
     */
    @Override
    public int insertFavorite(Favorite favorite) {
        favorite.setCreateTime(DateUtils.getNowDate());
        return favoriteMapper.insertFavorite(favorite);
    }

    /**
     * 修改收藏
     *
     * @param favorite 收藏
     * @return 结果
     */
    @Override
    public int updateFavorite(Favorite favorite) {
        favorite.setUpdateTime(DateUtils.getNowDate());
        return favoriteMapper.updateFavorite(favorite);
    }

    /**
     * 批量删除收藏
     *
     * @param ids 需要删除的收藏主键
     * @return 结果
     */
    @Override
    public int deleteFavoriteByIds(Long[] ids) {
        return favoriteMapper.deleteFavoriteByIds(ids);
    }

    /**
     * 删除收藏信息
     *
     * @param id 收藏主键
     * @return 结果
     */
    @Override
    public int deleteFavoriteById(Long id) {
        return favoriteMapper.deleteFavoriteById(id);
    }

    @Override
    public Map<Long, Favorite> selectMapByObjectIdAndTypeAndUserId(List<Long> objectIdList, Long objectType,
                                                                   Long userId) {
        Favorite favorite = new Favorite();
        favorite.setDelFlag(PublicCommon.ENABLE);
        favorite.setObjectIdList(objectIdList);
        favorite.setObjectType(objectType);
        favorite.setUserId(userId);
        List<Favorite> favoriteList = favoriteMapper.selectFavoriteList(favorite);
        return CollectionUtil.isNotEmpty(favoriteList) ?
            favoriteList.stream().collect(Collectors.toMap(Favorite::getObjectId, s -> s)) : new HashMap<>();
    }

    /**
     * 收藏/取消收藏
     */
    @Override
    public void addFavorite(Favorite.FavoriteBo bo) {
        Favorite favorite = new Favorite();
        favorite.setObjectId(bo.getObjectId());
        favorite.setObjectType(bo.getObjectType());
        favorite.setUserId(businessUtil.getLoginUser().getId());
        favorite.setCreateTime(DateUtils.getNowDate());
        favorite.setUpdateTime(DateUtils.getNowDate());
        favoriteMapper.addFavorite(favorite);

//        List<Favorite> favoriteList = favoriteMapper.selectFavoriteList(favorite);
//        if (CollectionUtil.isNotEmpty(favoriteList)) {
//            Favorite first = favoriteList.getFirst();
//            boolean whetherFavorite = Objects.equals(first.getDelFlag(), PublicCommon.ENABLE);
//            // 收藏对象类型：1-康复中心 2-科普 3-动态
//            if (first.getObjectType() == 1) {
//                dynamicsPostMapper.updateDynamicsPostLikesNum(bo.getObjectId(), whetherFavorite ? 1 : -1);
//            }
//        }
    }

    /**
     * 查询用户收藏数量
     */
    @Override
    public Long selectUserCollectionNum(Long userId) {
        return favoriteMapper.selectUserCollectionNum(userId);
    }

    @Override
    public void deleteFavorite(Long objectId, Long objectType) {
        Favorite favorite = new Favorite();
        favorite.setObjectId(objectId);
        favorite.setObjectType(objectType);
        List<Favorite> favoriteList = favoriteMapper.selectFavoriteList(favorite);
        if (CollectionUtil.isNotEmpty(favoriteList)) {
            Long[] favoriteIdArray = favoriteList.stream().map(Favorite::getId).toArray(Long[]::new);
            favoriteMapper.deleteFavoriteByIds(favoriteIdArray);
        }
    }

    @Override
    public void handlerFavoriteList(List<Favorite> favoriteList, List<String> selectOptions, Favorite favorite) {
        if (CollectionUtil.isEmpty(favoriteList)) {
            return;
        }

        List<Long> objectIdList = favoriteList.stream().map(Favorite::getObjectId).toList();

        Map<Long, RehabilitationCenter> rehabilitationCenterMap = new HashMap<>();
        Map<Long, Science> scienceMap = new HashMap<>();
        Map<Long, DynamicsPost> dynamicsPostMap = new HashMap<>();

        if (selectOptions.contains("selectRehabilitationCenterInfo")) {
            RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
            rehabilitationCenter.setRehabilitationCenterIdList(objectIdList);
            rehabilitationCenter.setClientLatitude(favorite.getLatitude());
            rehabilitationCenter.setClientLongitude(favorite.getLongitude());
            List<RehabilitationCenter> rehabilitationCenterList =
                rehabilitationCenterService.selectRehabilitationCenterList(rehabilitationCenter);
            rehabilitationCenterService.handlerRehabilitationCenterList(rehabilitationCenterList, List.of("lang"));
            if (CollectionUtil.isNotEmpty(rehabilitationCenterList)) {
                rehabilitationCenterMap =
                    rehabilitationCenterList.stream().collect(Collectors.toMap(RehabilitationCenter::getId, s -> s));
            }
        }

        if (selectOptions.contains("selectScienceInfo")) {
            Science science = new Science();
            science.setScienceIdList(objectIdList);
            List<Science> scienceList = scienceService.selectScienceList(science);
            scienceService.handlerScienceList(scienceList, List.of("lang"));
            if (CollectionUtil.isNotEmpty(scienceList)) {
                scienceMap = scienceList.stream().collect(Collectors.toMap(Science::getId, s -> s));
            }
        }

        if (selectOptions.contains("selectDynamicsPostInfo")) {
            DynamicsPost dynamicsPost = new DynamicsPost();
            dynamicsPost.setDynamicsPostIdList(objectIdList);
            List<DynamicsPost> dynamicsPostList = dynamicsPostService.selectDynamicsPostList(dynamicsPost);
            dynamicsPostService.handlerDynamicsPostList(dynamicsPostList, List.of("selectUserInfo", "whetherGiveLike"));
            if (CollectionUtil.isNotEmpty(dynamicsPostList)) {
                dynamicsPostMap = dynamicsPostList.stream().collect(Collectors.toMap(DynamicsPost::getId, s -> s));
            }
        }

        for (Favorite f : favoriteList) {
            if (selectOptions.contains("selectRehabilitationCenterInfo")) {
                RehabilitationCenter rehabilitationCenter = rehabilitationCenterMap.get(f.getObjectId());
                if (rehabilitationCenter != null) {
                    rehabilitationCenter.setWhetherFavoriteByLoginUser(true);
                    f.setRehabilitationCenter(rehabilitationCenter);
                }
            }
            if (selectOptions.contains("selectScienceInfo")) {
                Science science = scienceMap.get(f.getObjectId());
                if (science != null) {
                    science.setWhetherFavoriteByLoginUser(true);
                    f.setScience(science);
                }
            }
            if (selectOptions.contains("selectDynamicsPostInfo")) {
                DynamicsPost dynamicsPost = dynamicsPostMap.get(f.getObjectId());
                if (dynamicsPost != null) {
                    dynamicsPost.setWhetherFavoriteByLoginUser(true);
                    f.setDynamicsPost(dynamicsPost);
                }
            }
        }
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        Favorite favorite = new Favorite();
        favorite.setCreateStartTime(yesterdayRange[0]);
        favorite.setCreateEndTime(todayRange[1]);
        List<Favorite> favoriteList = favoriteMapper.selectFavoriteList(favorite);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(favoriteMapper.selectCount());
        if (CollUtil.isNotEmpty(favoriteList)) {
            vo.setTodayNumber(
                favoriteList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                favoriteList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }
}
