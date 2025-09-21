package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.Follow;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.LeaveWordSubMapper;
import com.ruoyi.mgkf.domain.LeaveWordSub;
import com.ruoyi.mgkf.service.ILeaveWordSubService;

/**
 * 留言子Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class LeaveWordSubServiceImpl implements ILeaveWordSubService 
{
    @Autowired
    private LeaveWordSubMapper leaveWordSubMapper;

    @Resource
    private IUserService userService;

    /**
     * 查询留言子
     * 
     * @param id 留言子主键
     * @return 留言子
     */
    @Override
    public LeaveWordSub selectLeaveWordSubById(Long id)
    {
        return leaveWordSubMapper.selectLeaveWordSubById(id);
    }

    /**
     * 查询留言子列表
     * 
     * @param leaveWordSub 留言子
     * @return 留言子
     */
    @Override
    public List<LeaveWordSub> selectLeaveWordSubList(LeaveWordSub leaveWordSub)
    {
        return leaveWordSubMapper.selectLeaveWordSubList(leaveWordSub);
    }

    /**
     * 新增留言子
     * 
     * @param leaveWordSub 留言子
     * @return 结果
     */
    @Override
    public int insertLeaveWordSub(LeaveWordSub leaveWordSub)
    {
        leaveWordSub.setCreateTime(DateUtils.getNowDate());
        return leaveWordSubMapper.insertLeaveWordSub(leaveWordSub);
    }

    /**
     * 修改留言子
     * 
     * @param leaveWordSub 留言子
     * @return 结果
     */
    @Override
    public int updateLeaveWordSub(LeaveWordSub leaveWordSub)
    {
        leaveWordSub.setUpdateTime(DateUtils.getNowDate());
        return leaveWordSubMapper.updateLeaveWordSub(leaveWordSub);
    }

    /**
     * 批量删除留言子
     * 
     * @param ids 需要删除的留言子主键
     * @return 结果
     */
    @Override
    public int deleteLeaveWordSubByIds(Long[] ids)
    {
        return leaveWordSubMapper.deleteLeaveWordSubByIds(ids);
    }

    /**
     * 删除留言子信息
     * 
     * @param id 留言子主键
     * @return 结果
     */
    @Override
    public int deleteLeaveWordSubById(Long id)
    {
        return leaveWordSubMapper.deleteLeaveWordSubById(id);
    }

    @Override
    public void handlerLeaveWordSubList(List<LeaveWordSub> leaveWordSubList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(leaveWordSubList)) {
            return;
        }

        List<Long> userIdList = leaveWordSubList.stream().map(LeaveWordSub::getSendUserId).toList();

        Map<Long, User> userMap = new HashMap<>();

        if (handlerOptions.contains("selectUserInfo")) {
            userMap = userService.selectMapByIds(userIdList);
        }

        for (LeaveWordSub leaveWordSub : leaveWordSubList) {
            if (handlerOptions.contains("selectUserInfo")) {
                User user = userMap.get(leaveWordSub.getSendUserId());
                if (user != null) {
                    leaveWordSub.setUserAvatar(user.getAvatar());
                }
            }
        }
    }

    /**
     * 设置消息已读
     */
    @Override
    public void readMessage(Long leaveWordId, Long userId) {
        leaveWordSubMapper.readMessage(leaveWordId, userId);
    }

    @Override
    public Map<Long, LeaveWordSub> selectLatestMessageByLeaveWordIdList(List<Long> leaveWordIdList) {
        List<LeaveWordSub> leaveWordSubList = leaveWordSubMapper.selectLatestMessageByLeaveWordIdList(leaveWordIdList);
        return CollectionUtil.isNotEmpty(leaveWordSubList) ?
            leaveWordSubList.stream().collect(Collectors.toMap(LeaveWordSub::getLeaveWordId, s -> s)) : new HashMap<>();
    }

    @Override
    public Map<Long, Long> selectUnReadMessageNumByLeaveWordIdList(List<Long> leaveWordIdList, Long userId) {
        List<LeaveWordSub> leaveWordSubList = leaveWordSubMapper.selectUnReadMessageByLeaveWordIdList(leaveWordIdList, userId);
        return CollectionUtil.isNotEmpty(leaveWordSubList) ?
            leaveWordSubList.stream().collect(Collectors.groupingBy(LeaveWordSub::getLeaveWordId, Collectors.counting())) : new HashMap<>();
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        LeaveWordSub leaveWordSub = new LeaveWordSub();
        leaveWordSub.setCreateStartTime(yesterdayRange[0]);
        leaveWordSub.setCreateEndTime(todayRange[1]);
        List<LeaveWordSub> leaveWordSubList = leaveWordSubMapper.selectLeaveWordSubList(leaveWordSub);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(leaveWordSubMapper.selectCount());
        if (CollUtil.isNotEmpty(leaveWordSubList)) {
            vo.setTodayNumber(
                leaveWordSubList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                leaveWordSubList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }
}
