package com.ruoyi.mgkf.utils;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

import java.util.Properties;

@Slf4j
public class EmailUtil {

    /**
     * 发件人邮箱地址
     */
    private static final String SENDER_EMAIL = "hello@naillover.co";

    /**
     * 发件人邮箱密码或应用专用密码
     */
    private static final String SENDER_PASSWORD = "azbpzudcoqkwqrhk";

    /**
     * 发送邮件
     *
     * @param recipientEmail 收件人邮箱地址
     * @param subject        邮件主题
     * @param content        邮件内容
     */
    public static boolean sendGmail(String recipientEmail, String subject, String content) {
        try {
            // 配置 SMTP 服务器属性
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            // 创建会话并进行身份验证
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(SENDER_EMAIL, SENDER_PASSWORD);
                }
            });

            // 创建邮件消息
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SENDER_EMAIL));
            message.setRecipients(Message.RecipientType.TO,
                InternetAddress.parse(recipientEmail));
            message.setSubject(subject);
            message.setText(content);

            // 发送邮件
            Transport.send(message);
            return true;
        } catch (Exception e) {
            log.error("邮件发送失败: {}", e.getMessage());
            return false;
        }
    }

    public static void main(String[] args) {
        sendGmail("1536623601@qq.com", "测试邮件", "这是一封测试邮件。");
    }
}
