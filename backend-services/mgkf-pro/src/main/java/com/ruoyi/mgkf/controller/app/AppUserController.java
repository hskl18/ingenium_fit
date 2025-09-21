package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


/**
 * 用户控制器
 */
@Slf4j
@RestController
@RequestMapping("/app/user")
public class AppUserController {

    @Resource
    private IUserService userService;

    @Resource
    private BusinessUtil businessUtil;


    /**
     * 注册账号
     */
    @PostMapping("/register")
    public R<String> register(@RequestBody User.UserRegisterBo bo) {
        return R.ok(userService.register(bo));
    }

    /**
     * 忘记密码
     */
    @PostMapping("/forgotPassword")
    public R<Void> forgotPassword(@RequestBody User.ForgotPasswordBo bo) {
        userService.forgotPassword(bo);
        return R.ok();
    }

    /**
     * 修改密码
     */
    @PostMapping("/changePassword")
    @UserLoginToken
    public R<Void> changePassword(@RequestBody User.ChangePasswordBo bo) {
        userService.changePassword(bo);
        return R.ok();
    }

    /**
     * 修改用户信息
     */
    @UserLoginToken
    @PostMapping(value = "/editUserInfo")
    public R<Void> editUserInfo(@RequestBody User bo) {
        userService.editUserInfo(bo, businessUtil.getLoginUser().getId());
        return R.ok();
    }

    /**
     * 获取登录用户信息
     */
    @GetMapping(value = "/getLoginUser")
    @UserLoginToken
    public R<User> getLoginUser() {
        return R.ok(userService.getLoginUser());
    }

    /**
     * 退出登录
     */
    @UserLoginToken
    @PostMapping("/logout")
    public R<Void> logout() {
        userService.logout();
        return R.ok();
    }

    /**
     * 注销账号
     */
    @PostMapping("/logOff")
    @UserLoginToken
    public R<Void> cancellation() {
        userService.cancellation(businessUtil.getLoginUser().getId());
        return R.ok();
    }
}
