package com.ruoyi.system.util;

import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.utils.ServletUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class LanguageUtil {

    public static final String DEFAULT_LANGUAGE = LanguageConstant.EN;

    public static List<String> SUPPORT_LANGUAGE_LIST = List.of(
        LanguageConstant.EN,
        LanguageConstant.ZH
    );

    /**
     * 获取当前语言
     *
     * @return 当前语言
     */
    public static String getLanguage() {
        HttpServletRequest request = ServletUtils.getRequest();
        if (request == null) {
            return DEFAULT_LANGUAGE;
        }
        String language = request.getHeader("lang");
        if (StrUtil.isEmpty(language)) {
            return DEFAULT_LANGUAGE;
        }
        return language;
    }

    /**
     * 是不是中文
     */
    public static boolean isZh() {
        return LanguageConstant.ZH.equals(getLanguage());
    }

    /**
     * 是不是英文
     */
    public static boolean isEn() {
        return LanguageConstant.EN.equals(getLanguage());
    }

    /**
     * 根据语言环境获取响应内容
     */
    public static String getResponseByLanguage(Map<String, String> responseMap) {
        // 根据当前语言获取
        String responseContent = responseMap.get(getLanguage());

        // 当前语言没有设置信息, 则返回默认语言
        if (StrUtil.isEmpty(responseContent)) {
            responseContent = responseMap.get(DEFAULT_LANGUAGE);
        }

        // 如果默认语言也没有设置信息, 则返回支持语言中第一个有信息的
        if (StrUtil.isEmpty(responseContent)) {
            for (String language : SUPPORT_LANGUAGE_LIST) {
                responseContent = responseMap.get(language);
                if (StrUtil.isNotEmpty(responseContent)) {
                    break;
                }
            }
        }

        // 返回最终信息
        return responseContent;
    }

    /**
     * 根据语言环境执行不同函数
     */
    public static void executeByLanguage(Map<String, Consumer<Object>> responseMap, Object param) {
        Consumer<Object> consumer = responseMap.get(getLanguage());
        if (consumer == null) {
            consumer = responseMap.get(DEFAULT_LANGUAGE);
        }
        if (consumer != null) {
            consumer.accept(param);
        }
    }
}
