package com.ruoyi.mgkf.controller.app.bo;

import com.ruoyi.mgkf.constant.PublicCommon;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class SendPhoneCaptchaBo implements Serializable {

    @Serial
    private static final long serialVersionUID = 4692227356081396158L;

    /**
     * 短信类型：1-账号注册 2-忘记密码
     */
    private Integer type;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 手机区号
     */
    private String areaCode = PublicCommon.DEFAULT_AREA_CODE;
}
