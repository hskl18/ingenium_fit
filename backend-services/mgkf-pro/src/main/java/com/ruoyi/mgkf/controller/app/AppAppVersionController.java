package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.domain.AppVersion;
import com.ruoyi.mgkf.service.IAppVersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * APP版本更新
 */
@RestController
@RequestMapping("/app/version")
public class AppAppVersionController extends BaseController {

    @Autowired
    private IAppVersionService appVersionService;

    /**
     * 查询最新版本
     */
    @PostMapping("/latest")
    public R<AppVersion> latest() {
        return R.ok(appVersionService.selectLatestVersion());
    }
}
