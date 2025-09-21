package com.ruoyi.mgkf.utils;

import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.utils.ServletUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.time.ZoneId;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ZoneUtil {

    public static final String DEFAULT_ZONE = ZoneId.systemDefault().getId();

    /**
     * 获取当前时区
     */
    public static String getZone() {
        HttpServletRequest request = ServletUtils.getRequest();
        if (request == null) {
            return DEFAULT_ZONE;
        }
        String zone = request.getHeader("client-zone");
        if (StrUtil.isEmpty(zone)) {
            return DEFAULT_ZONE;
        }
        return zone;
    }

}
