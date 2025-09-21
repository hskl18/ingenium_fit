package com.ruoyi.mgkf.handler;

import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.MessageUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.SendPhoneCaptchaBo;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

@Component
public class SendPhoneCaptchaHandler {

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IUserService userService;

    /**
     * 发送手机短信验证码之前处理逻辑
     */
    public void beforeSendPhoneCaptcha(SendPhoneCaptchaBo bo) {
        if (bo.getType() == 2) {
            User user = userService.selectUserByPhone(bo.getPhone());
            if (user == null) {
                throw new ServiceException(MessageUtils.message("account.not.exist"));
            }
            if (PublicCommon.isDisable(user.getDelFlag())) {
                throw new ServiceException(MessageUtils.message("account.is.disable"));
            }
        }
    }

    /**
     * 获取短信发送内容
     *
     * @param captcha 验证码
     */
    public String getSmsSendContent(String captcha) {
        return "【签名】验证码：" + captcha + "，有效期5分钟，如非本人操作，请忽略。";
    }

    /**
     * 短信验证码发送后逻辑处理
     *
     * @param isSendSuccess 短信发送结果
     * @param bo            发送短信请求参数
     * @param captcha       验证码
     */
    public void afterSendPhoneCaptcha(boolean isSendSuccess, SendPhoneCaptchaBo bo, String captcha) {
        if (isSendSuccess) {
            businessUtil.savePhoneCaptcha(bo.getPhone(), bo.getAreaCode(), bo.getType(), captcha);
        } else {
            throw new ServiceException(MessageUtils.message("captcha.send.fail"));
        }
    }
}
