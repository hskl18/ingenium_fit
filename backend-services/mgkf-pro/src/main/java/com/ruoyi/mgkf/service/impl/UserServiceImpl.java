package com.ruoyi.mgkf.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.ReUtil;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.MessageUtils;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.bo.BarChartAmountStatisticsBo;
import com.ruoyi.mgkf.controller.vo.BarChartAmountStatisticsVo;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.UserMapper;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;

/**
 * 用户Service业务层处理
 *
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private UserMapper userMapper;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private TokenService tokenService;

    @Resource
    private RedisCache redisCache;

    @Resource
    private HttpServletRequest request;

    /**
     * 查询用户
     *
     * @param id 用户主键
     * @return 用户
     */
    @Override
    public User selectUserById(Long id) {
        return userMapper.selectUserById(id);
    }

    /**
     * 查询用户列表
     *
     * @param user 用户
     * @return 用户
     */
    @Override
    public List<User> selectUserList(User user) {
        return userMapper.selectUserList(user);
    }

    /**
     * 新增用户
     *
     * @param user 用户
     * @return 结果
     */
    @Override
    public int insertUser(User user) {
        user.setCreateTime(DateUtils.getNowDate());
        return userMapper.insertUser(user);
    }

    /**
     * 修改用户
     *
     * @param user 用户
     * @return 结果
     */
    @Override
    public int updateUser(User user) {
        user.setUpdateTime(DateUtils.getNowDate());
        return userMapper.updateUser(user);
    }

    /**
     * 批量删除用户
     *
     * @param ids 需要删除的用户主键
     * @return 结果
     */
    @Override
    public int deleteUserByIds(Long[] ids) {
        return userMapper.deleteUserByIds(ids);
    }

    /**
     * 删除用户信息
     *
     * @param id 用户主键
     * @return 结果
     */
    @Override
    public int deleteUserById(Long id) {
        return userMapper.deleteUserById(id);
    }

    /**
     * 注册账号
     */
    @Override
    public String register(User.UserRegisterBo bo) {
        User user = new User();
        String account = bo.getAccount();
        // 判断是手机注册还是邮箱注册
        if (ReUtil.isMatch(PublicCommon.EMAIL_REGEX, account)) {
            // 邮箱注册
            businessUtil.checkEmailCaptcha(account, 1, bo.getCaptcha());
            // 校验邮箱唯一
            if (!emailWhetherUnique(account)) {
                throw new ServiceException(MessageUtils.message("email.been.occupied"));
            }
            user.setEmail(account);
        } else {
            // 手机注册
            businessUtil.checkPhoneCaptcha(account, bo.getAreaCode(), 1, bo.getCaptcha());
            // 校验手机号唯一
            if (!phoneWhetherUnique(account)) {
                throw new ServiceException(MessageUtils.message("phone.been.occupied"));
            }
            user.setPhone(account);
        }
        user.setFirstName(bo.getFirstName());
        user.setLastName(bo.getLastName());
        user.setLoginPwd(SecurityUtils.encryptPassword(bo.getLoginPwd()));
        user.setNickName(RandomUtil.randomString(8));
        user.setCreateDate(null);
        userMapper.insertUser(user);
        return businessUtil.createToken(user.getId());
    }

    /**
     * 校验手机号唯一
     *
     * @return true 唯一
     */
    private boolean phoneWhetherUnique(String phone) {
        User user = selectUserByPhone(phone);
        return user == null;
    }

    /**
     * 校验邮箱唯一
     *
     * @return true 唯一
     */
    private boolean emailWhetherUnique(String email) {
        User user = selectUserByEmail(email);
        return user == null;
    }

    /**
     * 忘记密码
     */
    @Override
    public void forgotPassword(User.ForgotPasswordBo bo) {
        User conditionUser = new User();
        String account = bo.getAccount();
        if (ReUtil.isMatch(PublicCommon.EMAIL_REGEX, account)) {
            // 邮箱忘记密码
            businessUtil.checkEmailCaptcha(account, 2, bo.getCaptcha());
            conditionUser.setEmail(account);
        } else {
            // 手机忘记密码
            businessUtil.checkPhoneCaptcha(account, bo.getAreaCode(), 2, bo.getCaptcha());
            conditionUser.setPhone(account);
        }
        List<User> userList = userMapper.selectUserList(conditionUser);
        if (CollectionUtil.isNotEmpty(userList)) {
            User user = userList.get(0);
            User updateUser = new User();
            updateUser.setId(user.getId());
            updateUser.setLoginPwd(SecurityUtils.encryptPassword(bo.getLoginPwd()));
            userMapper.updateUser(updateUser);
        }
    }

    /**
     * 根据邮箱查询用户
     */
    @Override
    public User selectUserByEmail(String email) {
        User user = new User();
        user.setEmail(email);
        List<User> userList = userMapper.selectUserList(user);
        return CollectionUtil.isNotEmpty(userList) ? userList.get(0) : null;
    }

    /**
     * 根据手机号查询用户
     */
    @Override
    public User selectUserByPhone(String phone) {
        User user = new User();
        user.setPhone(phone);
        List<User> userList = userMapper.selectUserList(user);
        return CollectionUtil.isNotEmpty(userList) ? userList.get(0) : null;
    }

    /**
     * 修改用户信息
     */
    @Override
    public void editUserInfo(User bo, Long userId) {
        bo.setId(userId);
        userMapper.updateUser(bo);
    }

    /**
     * 获取登录用户信息
     */
    @Override
    public User getLoginUser() {
        return businessUtil.getLoginUser();
    }

    /**
     * 退出登录
     */
    @Override
    public void logout() {
        String token = tokenService.getToken(request);
        redisCache.deleteObject(token);
    }

    /**
     * 注销账号
     */
    @Override
    public void cancellation(Long userId) {
        logout();
        User user = new User();
        user.setId(userId);
        user.setDelFlag(PublicCommon.DELETE);
        userMapper.updateUser(user);
    }

    @Override
    public Map<Long, User> selectMapByIds(List<Long> userIdList) {
        User user = new User();
        user.setUserIdList(userIdList);
        List<User> userList = userMapper.selectUserList(user);
        if (CollectionUtil.isNotEmpty(userList)) {
            return userList.stream().collect(Collectors.toMap(User::getId, s -> s));
        }
        return new HashMap<>();
    }

    /**
     * 修改密码
     */
    @Override
    public void changePassword(User.ChangePasswordBo bo) {
        User loginUser = businessUtil.getLoginUser();
        if (!SecurityUtils.matchesPassword(bo.getOldPassword(), loginUser.getLoginPwd())) {
            throw new ServiceException(MessageUtils.message("password.is.error"));
        }
        User user = new User();
        user.setLoginPwd(SecurityUtils.encryptPassword(bo.getNewPassword()));
        user.setId(loginUser.getId());
        userMapper.updateUser(user);
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        // 查询用户数据
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        User user = new User();
        user.setCreateStartTime(yesterdayRange[0]);
        user.setCreateEndTime(todayRange[1]);
        List<User> userList = userMapper.selectUserList(user);

        // 用户数量统计
        NumberStatisticsVo userStatistics = new NumberStatisticsVo();
        userStatistics.setCumulativeNumber(userMapper.selectCount());

        if (CollUtil.isNotEmpty(userList)) {
            userStatistics.setTodayNumber(
                userList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            userStatistics.setYesterdayNumber(
                userList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0], yesterdayRange[1])).count()
            );
            userStatistics.computeDayAnnulus();
        }
        return userStatistics;
    }

    @Override
    public List<BarChartAmountStatisticsVo> barChartModelStatistics(BarChartAmountStatisticsBo bo) {
        Long[] timeRange = getTimeRange(bo);
        User user = new User();
        user.setCreateStartTime(timeRange[0]);
        user.setCreateEndTime(timeRange[1]);
        List<User> userList = userMapper.selectUserList(user);
        Map<Long, Long[]> timeRangeMap = getTimeRangeMap(bo);
        List<BarChartAmountStatisticsVo> barChartAmountStatisticsVoList = new ArrayList<>();
        timeRangeMap.forEach((time, range) -> {
            BarChartAmountStatisticsVo barChartAmountStatisticsVo = new BarChartAmountStatisticsVo();
            barChartAmountStatisticsVo.setTimestamp(time);
            if (CollUtil.isNotEmpty(userList)) {
                barChartAmountStatisticsVo.setPeopleCount(
                    (int) userList.stream()
                        .filter(x -> TimeUtil.between(x.getCreateTime(), range[0], range[1]))
                        .count()
                );
            }
            barChartAmountStatisticsVoList.add(barChartAmountStatisticsVo);
        });
        return barChartAmountStatisticsVoList;
    }

    private Map<Long, Long[]> getTimeRangeMap(BarChartAmountStatisticsBo bo) {
        Integer timeType = bo.getTimeType();
        return switch (timeType) { // 时间类型：1-近一年 2-近一月 3-时间自定义
            case 1 -> TimeUtil.getMonthRangeMap(ZoneUtil.getZone(), -11);
            case 2 -> TimeUtil.getDayRangeMap(ZoneUtil.getZone(), -29);
            default ->
                TimeUtil.getCustomRangeMap(bo.getStartTimestamp(), bo.getEndTimestamp(), ZoneUtil.getZone());
        };
    }

    private Long[] getTimeRange(BarChartAmountStatisticsBo bo) {
        Integer timeType = bo.getTimeType();
        switch (timeType) { // 时间类型：1-近一年 2-近一月 3-时间自定义
            case 1:
                return TimeUtil.getMonthRange(ZoneUtil.getZone(), -11);
            case 2:
                return TimeUtil.getDayRange(ZoneUtil.getZone(), -29);
            default:
                Long[] timeRange = new Long[2];
                timeRange[0] = bo.getStartTimestamp();
                timeRange[1] = bo.getEndTimestamp();
                return timeRange;
        }
    }
}
