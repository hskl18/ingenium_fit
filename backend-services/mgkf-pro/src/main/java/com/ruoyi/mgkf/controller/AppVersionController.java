package com.ruoyi.mgkf.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.AppVersion;
import com.ruoyi.mgkf.service.IAppVersionService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * APP版本更新
 */
@RestController
@RequestMapping("/mgkf/version")
public class AppVersionController extends BaseController {

    @Autowired
    private IAppVersionService appVersionService;

    /**
     * 查询版本列表
     */
    @GetMapping("/list")
    public TableDataInfo<AppVersion> list(AppVersion appVersion) {
        startPage();
        List<AppVersion> list = appVersionService.selectAppVersionList(appVersion);
        return getDataTable(list);
    }

    /**
     * 获取版本详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(appVersionService.selectAppVersionById(id));
    }

    /**
     * 新增版本
     */
    @Log(title = "版本", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody AppVersion appVersion) {
        return toAjax(appVersionService.insertAppVersion(appVersion));
    }

    /**
     * 修改版本
     */
    @Log(title = "版本", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody AppVersion appVersion) {
        return toAjax(appVersionService.updateAppVersion(appVersion));
    }

    /**
     * 删除版本
     */
    @Log(title = "版本", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(appVersionService.deleteAppVersionByIds(ids));
    }
}
