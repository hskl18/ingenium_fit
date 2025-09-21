package com.ruoyi.mgkf.controller.app.bo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class SendEmailCaptchaBo implements Serializable {

    @Serial
    private static final long serialVersionUID = 4692227356081396158L;

    /**
     * 短信类型：1-账号注册 2-忘记密码
     */
    private Integer type;

    /**
     * 邮箱
     */
    private String email;
}
