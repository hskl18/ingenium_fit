package com.ruoyi.mgkf.utils.oss.properties;

import lombok.Data;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "oss.system")
@ConditionalOnProperty(prefix = "oss.system", name = "enabled", havingValue = "true")
public class SystemOssProperties {

    /**
     * 是否开启
     */
    private Boolean enabled;

    /**
     * 文件存储路径
     */
    private String path;
}
