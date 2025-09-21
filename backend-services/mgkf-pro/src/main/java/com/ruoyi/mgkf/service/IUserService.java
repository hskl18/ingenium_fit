package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.bo.BarChartAmountStatisticsBo;
import com.ruoyi.mgkf.controller.vo.BarChartAmountStatisticsVo;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.User;

/**
 * 用户Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IUserService 
{
    /**
     * 查询用户
     * 
     * @param id 用户主键
     * @return 用户
     */
    public User selectUserById(Long id);

    /**
     * 查询用户列表
     * 
     * @param user 用户
     * @return 用户集合
     */
    public List<User> selectUserList(User user);

    /**
     * 新增用户
     * 
     * @param user 用户
     * @return 结果
     */
    public int insertUser(User user);

    /**
     * 修改用户
     * 
     * @param user 用户
     * @return 结果
     */
    public int updateUser(User user);

    /**
     * 批量删除用户
     * 
     * @param ids 需要删除的用户主键集合
     * @return 结果
     */
    public int deleteUserByIds(Long[] ids);

    /**
     * 删除用户信息
     * 
     * @param id 用户主键
     * @return 结果
     */
    public int deleteUserById(Long id);

    /**
     * 注册账号
     */
    String register(User.UserRegisterBo bo);

    /**
     * 忘记密码
     */
    void forgotPassword(User.ForgotPasswordBo bo);

    /**
     * 根据邮箱查询用户
     */
    User selectUserByEmail(String email);

    /**
     * 根据手机号查询用户
     */
    User selectUserByPhone(String phone);

    /**
     * 修改用户信息
     */
    void editUserInfo(User bo, Long userId);

    /**
     * 获取登录用户信息
     */
    User getLoginUser();

    /**
     * 退出登录
     */
    void logout();

    /**
     * 注销账号
     */
    void cancellation(Long userId);

    Map<Long, User> selectMapByIds(List<Long> userIdList);

    /**
     * 修改密码
     */
    void changePassword(User.ChangePasswordBo bo);

    NumberStatisticsVo numberStatistics();

    List<BarChartAmountStatisticsVo> barChartModelStatistics(BarChartAmountStatisticsBo bo);
}
