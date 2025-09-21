package com.ruoyi.system.controller.app.login.controller;


import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ReUtil;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.MessageUtils;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.mgkf.controller.app.login.controller.bo.LoginBo;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.constant.PublicCommon;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


/**
 * 登陆控制器
 */
@Slf4j
@RestController
@RequestMapping("/app")
public class AppLoginController {

    @Resource
    private IUserService userService;

    @Resource
    private TokenService tokenService;


    @Resource
    private RedisCache redisCache;

    @Resource
    private BusinessUtil businessUtil;

    /**
     * 登录
     */
    @PostMapping("/login")
    public R<String> login(@RequestBody @Validated LoginBo bo) {
        // 根据邮箱查询用户
        User user = new User();
        String account = bo.getAccount();
        if (ReUtil.isMatch(PublicCommon.EMAIL_REGEX, account)) {
            user.setEmail(account);
        } else {
            user.setPhone(account);
        }
        List<User> userList = userService.selectUserList(user);
        if (CollectionUtil.isEmpty(userList)) {
            throw new ServiceException(MessageUtils.message("account.not.exist"));
        }
        User selectUser = userList.get(0);
        if (PublicCommon.isDisable(selectUser.getDelFlag())) {
            throw new ServiceException(MessageUtils.message("account.is.disable"));
        }
        if (!SecurityUtils.matchesPassword(bo.getPassword(), selectUser.getLoginPwd())) {
            throw new ServiceException(MessageUtils.message("password.is.error"));
        }
        return R.ok(businessUtil.createToken(selectUser.getId()));
    }
}
