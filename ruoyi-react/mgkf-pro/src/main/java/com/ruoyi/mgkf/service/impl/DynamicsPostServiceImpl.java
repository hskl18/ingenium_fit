package com.ruoyi.mgkf.service.impl;

import java.util.*;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.core.domain.BaseEntity;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.controller.vo.RankingListStatisticsVo;
import com.ruoyi.mgkf.domain.*;
import com.ruoyi.mgkf.mapper.FavoriteMapper;
import com.ruoyi.mgkf.mapper.FollowMapper;
import com.ruoyi.mgkf.mapper.UserMapper;
import com.ruoyi.mgkf.service.*;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.DynamicsPostMapper;

/**
 * 动态帖子Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class DynamicsPostServiceImpl implements IDynamicsPostService 
{
    @Autowired
    private DynamicsPostMapper dynamicsPostMapper;

    @Resource
    private IUserService userService;

    @Resource
    private IGiveLikeService giveLikeService;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private FollowMapper followMapper;

    @Resource
    private IDynamicsPostBlockService dynamicsPostBlockService;

    @Resource
    private IFavoriteService favoriteService;

    @Resource
    private IDynamicsPostCategoryService dynamicsPostCategoryService;

    @Resource
    private UserMapper userMapper;

    /**
     * 查询动态帖子
     * 
     * @param id 动态帖子主键
     * @return 动态帖子
     */
    @Override
    public DynamicsPost selectDynamicsPostById(Long id)
    {
        return dynamicsPostMapper.selectDynamicsPostById(id);
    }

    /**
     * 查询动态帖子列表
     * 
     * @param dynamicsPost 动态帖子
     * @return 动态帖子
     */
    @Override
    public List<DynamicsPost> selectDynamicsPostList(DynamicsPost dynamicsPost)
    {
        return dynamicsPostMapper.selectDynamicsPostList(dynamicsPost);
    }

    /**
     * 新增动态帖子
     * 
     * @param dynamicsPost 动态帖子
     * @return 结果
     */
    @Override
    public int insertDynamicsPost(DynamicsPost dynamicsPost)
    {
        if (dynamicsPost.getUserId() == null) {
            User user = new User();
            user.setAvatar(dynamicsPost.getUserAvatar());
            user.setNickName(dynamicsPost.getUserNickname());
            userMapper.insertUser(user);
            dynamicsPost.setUserId(user.getId());
        }
        dynamicsPost.setCreateTime(DateUtils.getNowDate());
        return dynamicsPostMapper.insertDynamicsPost(dynamicsPost);
    }

    /**
     * 修改动态帖子
     * 
     * @param dynamicsPost 动态帖子
     * @return 结果
     */
    @Override
    public int updateDynamicsPost(DynamicsPost dynamicsPost)
    {
        String userAvatar = dynamicsPost.getUserAvatar();
        String userNickname = dynamicsPost.getUserNickname();
        if (StrUtil.isNotEmpty(userAvatar) || StrUtil.isNotEmpty(userNickname)) {
            Long userId = dynamicsPost.getUserId();
            User user = new User();
            user.setAvatar(userAvatar);
            user.setNickName(userNickname);
            if (userId == null) {
                userMapper.insertUser(user);
                dynamicsPost.setUserId(user.getId());
            } else {
                user.setId(userId);
                userMapper.updateUser(user);
            }
        }
        dynamicsPost.setUpdateTime(DateUtils.getNowDate());
        return dynamicsPostMapper.updateDynamicsPost(dynamicsPost);
    }

    /**
     * 批量删除动态帖子
     * 
     * @param ids 需要删除的动态帖子主键
     * @return 结果
     */
    @Override
    public int deleteDynamicsPostByIds(Long[] ids)
    {
        return dynamicsPostMapper.deleteDynamicsPostByIds(ids);
    }

    /**
     * 删除动态帖子信息
     * 
     * @param id 动态帖子主键
     * @return 结果
     */
    @Override
    public int deleteDynamicsPostById(Long id)
    {
        int updateRow = dynamicsPostMapper.deleteDynamicsPostById(id);
        if (updateRow > 0) {
            favoriteService.deleteFavorite(id, 3L);
        }
        return updateRow;
    }

    /**
     * 处理动态帖子查询结果
     */
    @Override
    public void handlerDynamicsPostList(List<DynamicsPost> dynamicsPostList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(dynamicsPostList)) {
            return;
        }

        Long loginUserId = businessUtil.getLoginUser().getId();

        List<Long> userIdList = dynamicsPostList.stream().map(DynamicsPost::getUserId).toList();
        List<Long> dynamicsPostIdList = dynamicsPostList.stream().map(DynamicsPost::getId).toList();
        List<Long> dynamicsPostCategoryIdList = dynamicsPostList.stream().map(DynamicsPost::getDynamicsPostCategoryId).toList();

        Map<Long, User> userMap = new HashMap<>();
        Map<Long, GiveLike> giveLikeMap = new HashMap<>();
        Map<Long, DynamicsPostBlock> dynamicsPostBlockMap = new HashMap<>();
        List<DynamicsPost> dynamicsPostTimeGroupList = new ArrayList<>();
        Map<Long, Favorite> favoriteMap = new HashMap<>();
        Map<Long, DynamicsPostCategory> dynamicsPostCategoryMap = new HashMap<>();

        // 查询用户信息
        if (handlerOptions.contains("selectUserInfo")) {
            userMap = userService.selectMapByIds(userIdList);
        }

        // 查询点赞信息
        if (handlerOptions.contains("whetherGiveLike")) {
            giveLikeMap = giveLikeService.selectMapByObjectIdAndTypeAndUserId(dynamicsPostIdList, 1L, loginUserId);
        }

        if (handlerOptions.contains("whetherBlock")) {
            dynamicsPostBlockMap = dynamicsPostBlockService.selectMapByDynamicsPostIdListAndUserId(dynamicsPostIdList, loginUserId);
        }

        if (handlerOptions.contains("whetherFavorite")) {
            favoriteMap = favoriteService.selectMapByObjectIdAndTypeAndUserId(dynamicsPostIdList, 3L, businessUtil.getLoginUser().getId());
        }

        if (handlerOptions.contains("handlerTimeGroup")) {
            List<Long> dynamicsPostTimeGroupIdList = dynamicsPostList.stream()
                .flatMap(x -> Arrays.stream(x.getDynamicsPostIds().split(",")))
                .map(Long::valueOf)
                .toList();
            dynamicsPostTimeGroupList = dynamicsPostMapper.selectDynamicsPostByIds(dynamicsPostTimeGroupIdList);
            handlerDynamicsPostList(dynamicsPostTimeGroupList, List.of("selectUserInfo", "whetherGiveLike", "whetherFavorite"));
        }

        if (handlerOptions.contains("selectDynamicsPostCategoryInfo")) {
            dynamicsPostCategoryMap = dynamicsPostCategoryService.selectMapByIds(dynamicsPostCategoryIdList);
            dynamicsPostCategoryService.handlerDynamicsPostCategoryList(
                new ArrayList<>(dynamicsPostCategoryMap.values()),
                List.of("lang")
            );
        }

        for (DynamicsPost dynamicsPost : dynamicsPostList) {

            Long dynamicsPostId = dynamicsPost.getId();

            // 设置用户信息
            if (handlerOptions.contains("selectUserInfo")) {
                dynamicsPost.setUser(userMap.get(dynamicsPost.getUserId()));
            }
            // 判断登录用户是否点赞该动态帖子
            if (handlerOptions.contains("whetherGiveLike")) {
                dynamicsPost.setWhetherGiveLikeByLoginUser(giveLikeMap.containsKey(dynamicsPostId));
            }
            // 判断登录用户是否关注该帖子作者
            if (handlerOptions.contains("whetherFollow")) {
                Follow follow = new Follow();
                follow.setUserId(loginUserId);
                follow.setFollowUserId(dynamicsPost.getUserId());
                follow.setDelFlag(PublicCommon.ENABLE);
                dynamicsPost.setWhetherFollowByLoginUser(CollectionUtil.isNotEmpty(followMapper.selectFollowList(follow)));
            }
            if (handlerOptions.contains("whetherBlock")) {
                dynamicsPost.setWhetherBlockByLoginUser(dynamicsPostBlockMap.containsKey(dynamicsPostId));
            }
            if (handlerOptions.contains("handlerTimeGroup")) {
                dynamicsPost.setDynamicsPostList(
                    dynamicsPostTimeGroupList.stream()
                        .filter(x -> dynamicsPost.getDynamicsPostIds().contains(x.getId().toString()))
                        .sorted(Comparator.comparing(BaseEntity::getCreateTime).reversed())
                        .toList()
                );
            }
            if (handlerOptions.contains("whetherFavorite")) {
                dynamicsPost.setWhetherFavoriteByLoginUser(favoriteMap.containsKey(dynamicsPostId));
            }
            if (handlerOptions.contains("selectDynamicsPostCategoryInfo")) {
                dynamicsPost.setDynamicsPostCategory(dynamicsPostCategoryMap.get(dynamicsPost.getDynamicsPostCategoryId()));
            }
        }
    }

    /**
     * 修改转发数量
     */
    @Override
    public void updateForwardNum(Long dynamicsPostId, Long forwardNum) {
        dynamicsPostMapper.updateForwardNum(dynamicsPostId, forwardNum);
    }

    /**
     * 查询时间分组列表
     */
    @Override
    public List<DynamicsPost> selectDynamicsPostTimeGroupList(DynamicsPost dynamicsPost) {
        return dynamicsPostMapper.selectDynamicsPostTimeGroupList(dynamicsPost);
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        DynamicsPost dynamicsPost = new DynamicsPost();
        dynamicsPost.setCreateStartTime(yesterdayRange[0]);
        dynamicsPost.setCreateEndTime(todayRange[1]);
        List<DynamicsPost> dynamicsPostList = dynamicsPostMapper.selectDynamicsPostList(dynamicsPost);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(dynamicsPostMapper.selectCount());
        if (CollUtil.isNotEmpty(dynamicsPostList)) {
            vo.setTodayNumber(
                dynamicsPostList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                dynamicsPostList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }

    @Override
    public Map<Long, DynamicsPost> selectMapByIdList(List<Long> dynamicsPostIdList) {
        List<DynamicsPost> dynamicsPostList = dynamicsPostMapper.selectDynamicsPostByIds(dynamicsPostIdList);
        if (CollectionUtil.isEmpty(dynamicsPostList)) {
            return new HashMap<>();
        }
        return dynamicsPostList.stream().collect(Collectors.toMap(DynamicsPost::getId, s -> s));
    }

    /**
     * 修改动态帖子评论数量
     */
    @Override
    public void updateCommentNum(Long dynamicsPostId, Integer commentNum) {
        dynamicsPostMapper.updateCommentNum(dynamicsPostId, commentNum);
    }

    @Override
    public List<RankingListStatisticsVo> rankingListModelStatistics() {
        List<DynamicsPost> dynamicsPostList = dynamicsPostMapper.selectPublishRanking();
        if (CollectionUtil.isEmpty(dynamicsPostList)) {
            return new ArrayList<>();
        }
        List<Long> userIdList = dynamicsPostList.stream().map(DynamicsPost::getUserId).toList();
        Map<Long, User> userMap = userService.selectMapByIds(userIdList);
        return dynamicsPostList.stream().map(x -> {
            RankingListStatisticsVo vo = new RankingListStatisticsVo();
            vo.setRankingResult(Convert.convert(String.class, x.getPublishNum(), "0"));
            if (userMap.containsKey(x.getUserId())) {
                vo.setRankingObject(userMap.get(x.getUserId()).getNickName());
            }
            return vo;
        }).toList();
    }
}
