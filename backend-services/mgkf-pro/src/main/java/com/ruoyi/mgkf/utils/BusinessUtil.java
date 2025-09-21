package com.ruoyi.mgkf.utils;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.MessageUtils;
import com.ruoyi.framework.web.service.TokenService;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.mapper.UserMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class BusinessUtil {

    @Resource
    private RedisCache redisCache;

    @Resource
    private TokenService tokenService;

    @Resource
    private HttpServletRequest request;

    @Resource
    private UserMapper userMapper;

    public String createToken(Long userId) {
        String token = IdUtil.fastUUID();
        redisCache.setCacheObject(token, userId, 10, TimeUnit.DAYS);
        return tokenService.createToken(new HashMap<>() {{
            put(Constants.LOGIN_USER_KEY, token);
        }});
    }

    public User getLoginUser() {
        try {
            String token = tokenService.getToken(request);
            String loginUserKey = (String) tokenService.parseToken(token).get(Constants.LOGIN_USER_KEY);
            Long userId = redisCache.getCacheObject(loginUserKey);
            User user = userMapper.selectUserById(userId);
            if (user == null) {
                user = new User();
                user.setId(-1L);
            }
            return user;
        } catch (Exception e) {
            User user = new User();
            user.setId(-1L);
            return user;
        }
    }


    /**
     * 手机验证码校验
     */
    public void checkPhoneCaptcha(String phone, String areaCode, Integer type, String captcha) {
        String redisKey = areaCode + phone + type;
        String checkCaptcha = redisCache.getCacheObject(redisKey);
        if (StrUtil.isEmpty(checkCaptcha)) {
            throw new ServiceException(MessageUtils.message("captcha.expire"));
        }
        if (!captcha.equalsIgnoreCase(checkCaptcha)) {
            throw new ServiceException(MessageUtils.message("captcha.error"));
        }
        redisCache.deleteObject(redisKey);
    }

    /**
     * 保存手机验证码
     */
    public void savePhoneCaptcha(String phone, String areaCode, Integer type, String captcha) {
        String redisKey = areaCode + phone + type;
        redisCache.setCacheObject(redisKey, captcha, 5, TimeUnit.MINUTES);
    }

    /**
     * 邮箱验证码校验
     */
    public void checkEmailCaptcha(String email, Integer type, String captcha) {
        String redisKey = email + type;
        String checkCaptcha = redisCache.getCacheObject(redisKey);
        if (StrUtil.isEmpty(checkCaptcha)) {
            throw new ServiceException(MessageUtils.message("captcha.expire"));
        }
        if (!captcha.equalsIgnoreCase(checkCaptcha)) {
            throw new ServiceException(MessageUtils.message("captcha.error"));
        }
        redisCache.deleteObject(redisKey);
    }

    /**
     * 保存邮箱验证码
     */
    public void saveEmailCaptcha(String email, Integer type, String captcha) {
        String redisKey = email + type;
        redisCache.setCacheObject(redisKey, captcha, 5, TimeUnit.MINUTES);
    }
}
