package com.ruoyi.mgkf.controller.app.login.controller.bo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class LoginBo implements Serializable {

    @Serial
    private static final long serialVersionUID = -1454061740306833120L;

    /**
     * 账号(邮箱或手机号)
     */
    @NotBlank(message = "{account.not.blank}")
    private String account;

    /**
     * 密码
     */
    @NotBlank(message = "{password.not.blank}")
    private String password;
}
