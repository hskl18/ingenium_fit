package com.ruoyi.mgkf.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.domain.LeaveWordSub;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.mapper.UserMapper;
import com.ruoyi.mgkf.service.ILeaveWordSubService;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.NumberUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.LeaveWordMapper;
import com.ruoyi.mgkf.domain.LeaveWord;
import com.ruoyi.mgkf.service.ILeaveWordService;

/**
 * 留言Service业务层处理
 *
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class LeaveWordServiceImpl implements ILeaveWordService {
    @Autowired
    private LeaveWordMapper leaveWordMapper;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private UserMapper userMapper;

    @Resource
    private ILeaveWordSubService leaveWordSubService;

    @Resource
    private IUserService userService;

    /**
     * 查询留言
     *
     * @param id 留言主键
     * @return 留言
     */
    @Override
    public LeaveWord selectLeaveWordById(Long id) {
        return leaveWordMapper.selectLeaveWordById(id);
    }

    /**
     * 查询留言列表
     *
     * @param leaveWord 留言
     * @return 留言
     */
    @Override
    public List<LeaveWord> selectLeaveWordList(LeaveWord leaveWord) {
        return leaveWordMapper.selectLeaveWordList(leaveWord);
    }

    /**
     * 新增留言
     *
     * @param leaveWord 留言
     * @return 结果
     */
    @Override
    public int insertLeaveWord(LeaveWord leaveWord) {
        leaveWord.setCreateTime(DateUtils.getNowDate());
        return leaveWordMapper.insertLeaveWord(leaveWord);
    }

    /**
     * 修改留言
     *
     * @param leaveWord 留言
     * @return 结果
     */
    @Override
    public int updateLeaveWord(LeaveWord leaveWord) {
        leaveWord.setUpdateTime(DateUtils.getNowDate());
        return leaveWordMapper.updateLeaveWord(leaveWord);
    }

    /**
     * 批量删除留言
     *
     * @param ids 需要删除的留言主键
     * @return 结果
     */
    @Override
    public int deleteLeaveWordByIds(Long[] ids) {
        return leaveWordMapper.deleteLeaveWordByIds(ids);
    }

    /**
     * 删除留言信息
     *
     * @param id 留言主键
     * @return 结果
     */
    @Override
    public int deleteLeaveWordById(Long id) {
        return leaveWordMapper.deleteLeaveWordById(id);
    }

    @Override
    public LeaveWord createAndGetLeaveWordByUserId(LeaveWord.LeaveWordDetailBo bo) {
        User user = userMapper.selectUserById(bo.getUserId());
        LeaveWord leaveWord = new LeaveWord();
        leaveWord.setDelFlag(PublicCommon.ENABLE);
        leaveWord.setUserIds(NumberUtil.sortAscAndJoinLong(bo.getUserId(), businessUtil.getLoginUser().getId()));
        List<LeaveWord> leaveWordList = leaveWordMapper.selectLeaveWordList(leaveWord);
        if (CollectionUtil.isNotEmpty(leaveWordList)) {
            leaveWord = leaveWordList.get(0);
            leaveWord.setUser(user);
            // 设置消息已读
            leaveWordSubService.readMessage(leaveWord.getId(), bo.getUserId());
            return leaveWord;
        }
        leaveWord.setCreateTime(DateUtils.getNowDate());
        leaveWord.setUpdateTime(DateUtils.getNowDate());
        leaveWordMapper.insertLeaveWord(leaveWord);
        leaveWord.setUser(user);
        return leaveWord;
    }

    @Override
    public void handlerLeaveWordList(List<LeaveWord> leaveWordList, List<String> selectOptions) {
        if (CollectionUtil.isEmpty(leaveWordList)) {
            return;
        }

        Long loginUserId = businessUtil.getLoginUser().getId();
        List<Long> leaveWordIdList = leaveWordList.stream().map(LeaveWord::getId).toList();

        List<Long> userIdList = leaveWordList.stream()
            .flatMap(x -> Arrays.stream(x.getUserIds().split(",")))
            .map(Long::valueOf)
            .filter(x -> !x.equals(loginUserId))
            .toList();

        Map<Long, User> userMap = new HashMap<>();
        Map<Long, LeaveWordSub> leaveWordSubMap = new HashMap<>();
        Map<Long, Long> unReadMessageNumMap = new HashMap<>();

        if (selectOptions.contains("selectUserInfo") && CollectionUtil.isNotEmpty(userIdList)) {
            userMap = userService.selectMapByIds(userIdList);
        }

        if (selectOptions.contains("selectLatestMessage")) {
            leaveWordSubMap = leaveWordSubService.selectLatestMessageByLeaveWordIdList(leaveWordIdList);
        }

        if (selectOptions.contains("selectUnReadMessageNum")) {
            unReadMessageNumMap = leaveWordSubService.selectUnReadMessageNumByLeaveWordIdList(leaveWordIdList, loginUserId);
        }

        for (LeaveWord leaveWord : leaveWordList) {
            Long leaveWordId = leaveWord.getId();

            if (selectOptions.contains("selectUserInfo") && CollectionUtil.isNotEmpty(userIdList)) {
                Long userId = Arrays.stream(leaveWord.getUserIds().split(",")).map(Long::valueOf)
                    .filter(x -> !x.equals(loginUserId)).findFirst().orElse(null);
                if (userId != null) {
                    leaveWord.setUserId(userId);
                    leaveWord.setUser(userMap.get(userId));
                }
            }

            if (selectOptions.contains("selectLatestMessage")) {
                leaveWord.setLatestLeaveWordSub(leaveWordSubMap.get(leaveWordId));
            }

            if (selectOptions.contains("selectUnReadMessageNum")) {
                leaveWord.setUnReadMessageNum(unReadMessageNumMap.get(leaveWordId));
            }
        }
    }

    @Override
    public LeaveWord unReadNumAndLatest(Long userId) {
        LeaveWord leaveWord = new LeaveWord();
        leaveWord.setUnReadMessageNum(leaveWordMapper.selectUnReadNum(userId));
        leaveWord.setLatestLeaveWordSub(leaveWordMapper.selectLatestMessage(userId));
        return leaveWord;
    }
}
