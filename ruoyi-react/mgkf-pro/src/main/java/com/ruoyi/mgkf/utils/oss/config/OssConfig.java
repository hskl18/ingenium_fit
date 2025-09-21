package com.ruoyi.mgkf.utils.oss.config;

import com.ruoyi.mgkf.utils.oss.controller.SystemOssController;
import com.ruoyi.mgkf.utils.oss.properties.SystemOssProperties;
import jakarta.annotation.Resource;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties({SystemOssProperties.class})
public class OssConfig implements WebMvcConfigurer {

    @Resource
    private SystemOssProperties systemOssProperties;

    @Bean
    @ConditionalOnProperty(prefix = "oss.system", name = "enabled", havingValue = "true")
    public SystemOssController systemOssController() {
        return new SystemOssController();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(systemOssProperties.getPath() + "/**")
                .addResourceLocations("file:" + systemOssProperties.getPath() + "/");
    }
}
