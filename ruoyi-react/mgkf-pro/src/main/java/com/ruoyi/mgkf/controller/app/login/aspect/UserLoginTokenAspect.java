package com.ruoyi.mgkf.controller.app.login.aspect;

import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.MessageUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.constant.PublicCommon;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.concurrent.TimeUnit;

/**
 * app自定义token认证
 */
@Aspect
@Component
public class UserLoginTokenAspect {

    @Resource
    private RedisCache redisCache;

    @Resource
    private TokenService tokenService;

    @Resource
    private IUserService userService;

    @Around("@annotation(com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken)")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        Signature signature = point.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method method = methodSignature.getMethod();
        UserLoginToken annotation = method.getAnnotation(UserLoginToken.class);
        if (annotation != null) {
            ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = attributes.getRequest();
            return checkUserToken(request, point, annotation);
        }
        return point.proceed();
    }

    private Object checkUserToken(HttpServletRequest request, ProceedingJoinPoint point, UserLoginToken annotation) throws Throwable {
        String token = tokenService.getToken(request);

        if (StrUtil.isEmpty(token)) {
            throw new ServiceException(MessageUtils.message("token.not.exist"), 700);
        }

        Long userId = null;
        try {
            userId = redisCache.getCacheObject((String) tokenService.parseToken(token).get(Constants.LOGIN_USER_KEY));;
        } catch (Exception e) {
            throw new ServiceException(MessageUtils.message("login.expired"), 700);
        }
        if (userId == null) {
            throw new ServiceException(MessageUtils.message("login.expired"), 700);
        }

        User user = userService.selectUserById(userId);

        if (user == null) {
            throw new ServiceException(MessageUtils.message("login.expired"), 700);
        }

        if (PublicCommon.isDisable(user.getDelFlag())) {
            throw new ServiceException(MessageUtils.message("account.is.disable"));
        }

        redisCache.setCacheObject(token, userId, 10, TimeUnit.DAYS);

        request.setAttribute("loginUser", user);

        return point.proceed();
    }
}
