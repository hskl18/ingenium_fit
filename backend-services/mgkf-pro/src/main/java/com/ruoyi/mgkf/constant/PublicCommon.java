package com.ruoyi.mgkf.constant;


public class PublicCommon {

    /**
     * 默认区号
     */
    public static final String DEFAULT_AREA_CODE = "+86";

    /**
     * 默认用户端口
     */
    public static final Integer DEFAULT_USER_PORT = 1;

    /**
     * 邮箱正则表达式
     */
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$";

    /**
     * 记录状态
     */
    public static final Long ENABLE = 1L;
    public static final Long DELETE = 2L;
    public static final Long DISABLE = 3L;

    public static boolean isDisable(Long delFlag) {
        return delFlag.equals(DISABLE);
    }
}
