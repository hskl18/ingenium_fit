package com.ruoyi.mgkf.controller.app;

import cn.hutool.core.util.RandomUtil;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.controller.app.bo.SendEmailCaptchaBo;
import com.ruoyi.mgkf.controller.app.bo.SendPhoneCaptchaBo;
import com.ruoyi.mgkf.handler.SendEmailCaptchaHandler;
import com.ruoyi.mgkf.handler.SendPhoneCaptchaHandler;
import com.ruoyi.mgkf.utils.EmailUtil;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.system.util.LanguageUtil;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

/**
 * 验证码控制器
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/app/sms")
public class AppSmsController {

    @Resource
    private SendPhoneCaptchaHandler sendPhoneCaptchaHandler;

    /**
     * 发送手机短信验证码
     */
    @PostMapping("/phone/send")
    public R<String> sendPhoneCaptcha(@RequestBody SendPhoneCaptchaBo bo) {
        // 短信验证码发送前逻辑处理
        sendPhoneCaptchaHandler.beforeSendPhoneCaptcha(bo);
        // 生成验证码
        String captcha = RandomUtil.randomNumbers(4);
        // 记录验证码发送结果
        boolean isSendSuccess = true; // TODO 调用三方发送验证码
        // 短信验证码发送后逻辑处理
        sendPhoneCaptchaHandler.afterSendPhoneCaptcha(isSendSuccess, bo, captcha);
        // 如果不是生产环境直接返回验证码
        return R.ok(captcha);
    }

    @Resource
    private SendEmailCaptchaHandler sendEmailCaptchaHandler;

    /**
     * 发送邮箱验证码
     */
    @PostMapping("/email/send")
    public R<String> sendEmailCaptcha(@RequestBody SendEmailCaptchaBo bo) {
        // 邮箱验证码发送前逻辑处理
        sendEmailCaptchaHandler.beforeSendEmailCaptcha(bo);
        // 生成验证码
        String captcha = RandomUtil.randomNumbers(4);
        // 记录验证码发送结果
        boolean isSendSuccess = true;
        isSendSuccess = EmailUtil.sendGmail(bo.getEmail(),
            LanguageUtil.getResponseByLanguage(
                new HashMap<>() {{
                    put(LanguageConstant.ZH, "验证码");
                    put(LanguageConstant.EN, "Captcha");
                }}
            ),
            LanguageUtil.getResponseByLanguage(
                new HashMap<>() {{
                    put(LanguageConstant.ZH, "验证码：" + captcha + "，有效期5分钟，如非本人操作，请忽略。");
                    put(LanguageConstant.EN, "Captcha：" + captcha + ", valid for 5 minutes, please ignore if not your" +
                        " operation.");
                }}
            )
        );
        // 验证码发送后逻辑处理
        sendEmailCaptchaHandler.afterSendEmailCaptcha(isSendSuccess, bo, captcha);
        // 如果不是生产环境直接返回验证码
        return R.ok(captcha);
    }
}
