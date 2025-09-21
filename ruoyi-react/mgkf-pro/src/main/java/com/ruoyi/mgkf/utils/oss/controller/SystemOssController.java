package com.ruoyi.mgkf.utils.oss.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.utils.oss.properties.SystemOssProperties;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * 系统文件上传
 */
@RestController
@RequestMapping("/app/system/oss")
@Slf4j
public class SystemOssController {

    @Resource
    private SystemOssProperties systemOssProperties;

    /**
     * 上传文件
     */
    @PostMapping("/upload")
    public R<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 验证文件是否为空
            if (file.isEmpty()) {
                return R.fail("Uploaded files cannot be empty.");
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFileName = UUID.randomUUID() + fileExtension;

            // 创建上传目录（如果不存在）
            Path uploadPath = Paths.get(systemOssProperties.getPath());
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 保存文件到服务器
            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 返回成功响应（包含文件URL）
            String fileUrl = systemOssProperties.getPath() + "/" + uniqueFileName;
            return R.ok(fileUrl);
        } catch (Exception e) {
            log.error("上传文件失败：", e);
            return R.fail("Uploading file failed");
        }
    }

    // 获取文件扩展名
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.'));
    }

}
