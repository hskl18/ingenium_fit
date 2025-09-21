package com.ruoyi.mgkf.handler;

import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.MessageUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.SendEmailCaptchaBo;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

@Component
public class SendEmailCaptchaHandler {

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IUserService userService;

    /**
     * 发送邮箱验证码之前处理逻辑
     */
    public void beforeSendEmailCaptcha(SendEmailCaptchaBo bo) {
        if (bo.getType() == 2) {
            User user = userService.selectUserByEmail(bo.getEmail());
            if (user == null) {
                throw new ServiceException(MessageUtils.message("account.not.exist"));
            }
            if (PublicCommon.isDisable(user.getDelFlag())) {
                throw new ServiceException(MessageUtils.message("account.is.disable"));
            }
        }
    }

    /**
     * 获取邮箱发送内容
     *
     * @param captcha 验证码
     */
    public String getEmailSendContent(String captcha) {
        return "【签名】验证码：" + captcha + "，有效期5分钟，如非本人操作，请忽略。";
    }

    /**
     * 邮箱验证码发送后逻辑处理
     *
     * @param isSendSuccess 发送结果
     * @param bo            请求参数
     * @param captcha       验证码
     */
    public void afterSendEmailCaptcha(Boolean isSendSuccess, SendEmailCaptchaBo bo, String captcha) {
        if (isSendSuccess) {
            businessUtil.saveEmailCaptcha(bo.getEmail(), bo.getType(), captcha);
        } else {
            throw new ServiceException("captcha.send.fail");
        }
    }

    /**
     * 获取邮箱主题
     */
    public String getEmailSubject() {
        return "验证码";
    }
}
