package com.ruoyi.mgkf.utils;

import cn.hutool.crypto.SecureUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpUtil;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SmsUtil {
    private static final String ZT_USERNAME = "";
    private static final String ZT_PASSWORD = "";
    public boolean sendZtSms(String sendContent, String areaCode, String phone) {
        try {
            String url = "+86".equals(areaCode) ?
                "https://api.mix2.zthysms.com/v2/sendSms"
                : "https://api-ogw.zthysms.com/ims/v1/send";
            JSONObject param = new JSONObject();
            param.put("content", sendContent);
            if ("+86".equals(areaCode)) {
                Long tKey = System.currentTimeMillis() / 1000;
                param.put("username", ZT_USERNAME);
                param.put("password", Md5Password(tKey));
                param.put("tKey", String.valueOf(tKey));
                param.put("mobile", phone);
            } else {
                param.put("phone", phone);
                param.put("type", "YZM"); // 短信类型 固定值：YZM（验证码） YX(营销)
            }
            HttpRequest request = HttpUtil.createPost(url);
            if (!"+86".equals(areaCode)) {
                request.header("Authorization",
                    "Basic " + Base64.getUrlEncoder().encodeToString((ZT_USERNAME + ":" + ZT_PASSWORD).getBytes()));
            }
            String reqParam = param.toJSONString();
            log.info("发送助通短信请求参数: {}", reqParam);
            String body = request.body(reqParam)
                .execute()
                .body();
            log.info("发送助通短信响应结果: {}", body);
            if ("+86".equals(areaCode)) {
                return JSON.parseObject(body).getString("msg").equals("success");
            } else {
                return JSON.parseObject(body).getString("msg").equals("OK");
            }
        } catch (Exception e) {
            return false;
        }
    }

    private static String Md5Password(Long tKey) {
        return SecureUtil.md5(SecureUtil.md5(ZT_PASSWORD) + tKey);
    }

    private static final String X88_SUB_ACCOUNT_ID = "";
    private static final String X88_API_KEY = "";
    public boolean sendX88Sms(String sendContent, String areaCode, String phone) {
        try {
            String url = "https://sms.8x8.com/api/v1/subaccounts/" + X88_SUB_ACCOUNT_ID + "/messages";
            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put("destination", areaCode + phone);
            paramMap.put("text", sendContent);
            paramMap.put("source", "Likely-SCAM");
            log.info("短信参数: {}", JSON.toJSONString(paramMap));
            String body = HttpRequest.post(url)
                .header("content-type", "application/json")
                .header("authorization", "Bearer " + X88_API_KEY)
                .body(JSON.toJSONString(paramMap))
                .execute()
                .body();
            JSONObject jo = JSON.parseObject(body);
            log.info("短信发送结果:{}", body);
            return jo.getJSONObject("status").getString("code").equals("QUEUED");
        } catch (Exception e) {
            log.error("发送验证码失败", e);
            return false;
        }
    }
}
