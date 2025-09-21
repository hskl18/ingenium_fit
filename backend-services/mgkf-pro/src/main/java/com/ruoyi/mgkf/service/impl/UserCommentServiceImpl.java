package com.ruoyi.mgkf.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.core.domain.BaseEntity;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.*;
import com.ruoyi.mgkf.mapper.UserCommentReplyMapper;
import com.ruoyi.mgkf.service.*;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.UserCommentMapper;

/**
 * 用户评论Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class UserCommentServiceImpl implements IUserCommentService 
{
    @Autowired
    private UserCommentMapper userCommentMapper;

    @Resource
    private IUserService userService;

    @Resource
    private IUserCommentReplyService userCommentReplyService;

    @Resource
    @Lazy
    private IRehabilitationCenterService rehabilitationCenterService;

    @Resource
    @Lazy
    private IDynamicsPostService dynamicsPostService;

    @Resource
    @Lazy
    private IScienceService scienceService;

    @Resource
    @Lazy
    private IDoctorService doctorService;

    /**
     * 查询用户评论
     * 
     * @param id 用户评论主键
     * @return 用户评论
     */
    @Override
    public UserComment selectUserCommentById(Long id)
    {
        return userCommentMapper.selectUserCommentById(id);
    }

    /**
     * 查询用户评论列表
     * 
     * @param userComment 用户评论
     * @return 用户评论
     */
    @Override
    public List<UserComment> selectUserCommentList(UserComment userComment)
    {
        return userCommentMapper.selectUserCommentList(userComment);
    }

    /**
     * 新增用户评论
     * 
     * @param userComment 用户评论
     * @return 结果
     */
    @Override
    public int insertUserComment(UserComment userComment)
    {
        if (userComment.getUserId() == null) {
            User user = new User();
            user.setAvatar(userComment.getUserAvatar());
            user.setNickName(userComment.getUserNickname());
            userService.insertUser(user);
            userComment.setUserId(user.getId());
        }
        userComment.setCreateTime(DateUtils.getNowDate());
        return userCommentMapper.insertUserComment(userComment);
    }

    /**
     * 修改用户评论
     * 
     * @param userComment 用户评论
     * @return 结果
     */
    @Override
    public int updateUserComment(UserComment userComment)
    {
        Long userId = userComment.getUserId();
        User user = new User();
        user.setAvatar(userComment.getUserAvatar());
        user.setNickName(userComment.getUserNickname());
        if (userId == null) {
            userService.insertUser(user);
            userComment.setUserId(user.getId());
        } else {
            user.setId(userId);
            userService.updateUser(user);
        }
        userComment.setUpdateTime(DateUtils.getNowDate());
        return userCommentMapper.updateUserComment(userComment);
    }

    /**
     * 批量删除用户评论
     * 
     * @param ids 需要删除的用户评论主键
     * @return 结果
     */
    @Override
    public int deleteUserCommentByIds(Long[] ids)
    {
        UserComment userComment = new UserComment();
        userComment.setUserCommentIdList(new ArrayList<>(Arrays.asList(ids)));
        List<UserComment> userCommentList = userCommentMapper.selectUserCommentList(userComment);
        int updateRow = userCommentMapper.deleteUserCommentByIds(ids);
        if (updateRow > 0) {
            userCommentList.forEach(x -> {
                Long objectType = x.getObjectType();
                Long objectId = x.getObjectId();
                // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
                if (objectType == 3) {
                    rehabilitationCenterService.computeStar(objectId);
                    rehabilitationCenterService.updateCommentNum(objectId, -1);
                } else if (objectType == 4) {
                    doctorService.computeStar(objectId);
                    doctorService.updateCommentNum(objectId, -1);
                } else if (objectType == 1) {
                    dynamicsPostService.updateCommentNum(objectId, -1);
                } else if (objectType == 2) {
                    scienceService.updateCommentNum(objectId, -1);
                }
            });
        }
        return updateRow;
    }

    /**
     * 删除用户评论信息
     * 
     * @param id 用户评论主键
     * @return 结果
     */
    @Override
    public int deleteUserCommentById(Long id)
    {
        return userCommentMapper.deleteUserCommentById(id);
    }

    /**
     * 计算星级
     *
     * @param objectId   对象id
     * @param objectType 对象类型
     */
    @Override
    public Double computeStar(Long objectId, Long objectType) {
        UserComment userComment = new UserComment();
        userComment.setDelFlag(PublicCommon.ENABLE);
        userComment.setObjectId(objectId);
        userComment.setObjectType(objectType);
        List<UserComment> userCommentList = userCommentMapper.selectUserCommentList(userComment);
        if (CollectionUtil.isEmpty(userCommentList)) {
            return null;
        }
        return new BigDecimal(userCommentList.stream().mapToDouble(UserComment::getStar).sum() + "")
            .divide(new BigDecimal(userCommentList.size() + ""), 1, RoundingMode.HALF_UP).doubleValue();
    }

    /**
     * 处理评论查询结果
     */
    @Override
    public void handlerUserCommentList(List<UserComment> userCommentList, List<String> handleOptions) {
        if (CollectionUtil.isEmpty(userCommentList)) {
            return;
        }

        List<Long> userIdList = userCommentList.stream().map(UserComment::getUserId).toList();
        List<Long> userCommentIdList = userCommentList.stream().map(UserComment::getId).toList();
        List<Long> dynamicsPostIdList = userCommentList.stream().filter(x -> x.getObjectType() == 1).map(UserComment::getObjectId).toList();
        List<Long> scienceIdList = userCommentList.stream().filter(x -> x.getObjectType() == 2).map(UserComment::getObjectId).toList();
        List<Long> rehabilitationCenterIdList = userCommentList.stream().filter(x -> x.getObjectType() == 3).map(UserComment::getObjectId).toList();
        List<Long> doctorIdList = userCommentList.stream().filter(x -> x.getObjectType() == 4).map(UserComment::getObjectId).toList();

        Map<Long, User> userMap = new HashMap<>();
        Map<Long, List<UserCommentReply>> userCommentReplyMap = new HashMap<>();
        Map<Long, RehabilitationCenter> rehabilitationCenterMap = new HashMap<>();
        Map<Long, Science> scienceMap = new HashMap<>();
        Map<Long, DynamicsPost> dynamicsPostMap = new HashMap<>();
        Map<Long, Doctor> doctorMap = new HashMap<>();

        if (handleOptions.contains("selectUserInfo")) {
            userMap = userService.selectMapByIds(userIdList);
        }

        if (handleOptions.contains("selectReplyComment")) {
            userCommentReplyMap =  userCommentReplyService.selectMapByUserCommentIdList(userCommentIdList);
            userCommentReplyService.handlerUserCommentReplyList(
                new ArrayList<>(userCommentReplyMap.values().stream().flatMap(List::stream).toList()),
                List.of("selectUserInfo")
            );
        }

        if (handleOptions.contains("selectRehabilitationCenterInfo") && CollectionUtil.isNotEmpty(rehabilitationCenterIdList)) {
            RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
            rehabilitationCenter.setRehabilitationCenterIdList(rehabilitationCenterIdList);
            List<RehabilitationCenter> rehabilitationCenterList = rehabilitationCenterService.selectRehabilitationCenterList(rehabilitationCenter);
            rehabilitationCenterService.handlerRehabilitationCenterList(rehabilitationCenterList, List.of("lang"));
            if (CollectionUtil.isNotEmpty(rehabilitationCenterList)) {
                rehabilitationCenterMap = rehabilitationCenterList.stream().collect(Collectors.toMap(RehabilitationCenter::getId, s -> s));
            }
        }

        if (handleOptions.contains("selectScienceInfo") && CollectionUtil.isNotEmpty(scienceIdList)) {
            Science science = new Science();
            science.setScienceIdList(scienceIdList);
            List<Science> scienceList = scienceService.selectScienceList(science);
            scienceService.handlerScienceList(scienceList, List.of("lang"));
            if (CollectionUtil.isNotEmpty(scienceList)) {
                scienceMap = scienceList.stream().collect(Collectors.toMap(Science::getId, s -> s));
            }
        }

        if (handleOptions.contains("selectDynamicsPostInfo") && CollectionUtil.isNotEmpty(dynamicsPostIdList)) {
            DynamicsPost dynamicsPost = new DynamicsPost();
            dynamicsPost.setDynamicsPostIdList(dynamicsPostIdList);
            List<DynamicsPost> dynamicsPostList = dynamicsPostService.selectDynamicsPostList(dynamicsPost);
            if (CollectionUtil.isNotEmpty(dynamicsPostList)) {
                dynamicsPostMap = dynamicsPostList.stream().collect(Collectors.toMap(DynamicsPost::getId, s -> s));
            }
        }

        if (handleOptions.contains("selectDoctorInfo") && CollectionUtil.isNotEmpty(doctorIdList)) {
            Doctor doctor = new Doctor();
            doctor.setDoctorIdList(doctorIdList);
            List<Doctor> doctorList = doctorService.selectDoctorList(doctor);
            doctorService.handlerDoctorList(doctorList, List.of("lang"));
            if (CollectionUtil.isNotEmpty(doctorList)) {
                doctorMap = doctorList.stream().collect(Collectors.toMap(Doctor::getId, s -> s));
            }
        }

        for (UserComment userComment : userCommentList) {
            if (handleOptions.contains("selectUserInfo")) {
                userComment.setUser(userMap.get(userComment.getUserId()));
            }
            if (handleOptions.contains("selectRehabilitationCenterInfo") && CollectionUtil.isNotEmpty(rehabilitationCenterIdList)) {
                userComment.setRehabilitationCenter(rehabilitationCenterMap.get(userComment.getObjectId()));
            }
            if (handleOptions.contains("selectScienceInfo") && CollectionUtil.isNotEmpty(scienceIdList)) {
                userComment.setScience(scienceMap.get(userComment.getObjectId()));
            }
            if (handleOptions.contains("selectDynamicsPostInfo") && CollectionUtil.isNotEmpty(dynamicsPostIdList)) {
                userComment.setDynamicsPost(dynamicsPostMap.get(userComment.getObjectId()));
            }
            if (handleOptions.contains("selectDoctorInfo") && CollectionUtil.isNotEmpty(doctorIdList)) {
                userComment.setDoctor(doctorMap.get(userComment.getObjectId()));
            }
            if (handleOptions.contains("selectReplyComment")) {
                List<UserCommentReply> userCommentReplyList = userCommentReplyMap.get(userComment.getId());
                if (CollectionUtil.isNotEmpty(userCommentReplyList)) {
                    userComment.setUserCommentReplyList(
                        userCommentReplyList.stream().sorted(Comparator.comparing(BaseEntity::getCreateTime)).toList()
                    );
                }
            }
        }
    }

    /**
     * 更新评论数
     *
     * @param objectType 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
     */
    @Override
    public void updateCommentNum(Long objectType, Long objectId) {
        if (objectType == 3) {
            rehabilitationCenterService.computeStar(objectId);
            rehabilitationCenterService.updateCommentNum(objectId, 1);
        } else if (objectType == 4) {
            doctorService.computeStar(objectId);
            doctorService.updateCommentNum(objectId, 1);
        } else if (objectType == 1) {
            dynamicsPostService.updateCommentNum(objectId, 1);
        } else if (objectType == 2) {
            scienceService.updateCommentNum(objectId, 1);
        }
    }
}
