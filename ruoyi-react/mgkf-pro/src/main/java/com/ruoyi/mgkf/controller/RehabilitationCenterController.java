package com.ruoyi.mgkf.controller;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.RehabilitationCenter;
import com.ruoyi.mgkf.service.IRehabilitationCenterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 康复中心
 */
@RestController
@RequestMapping("/mgkf/center")
public class RehabilitationCenterController extends BaseController {

    @Autowired
    private IRehabilitationCenterService rehabilitationCenterService;

    /**
     * 查询康复中心列表
     */
    @GetMapping("/list")
    public TableDataInfo<RehabilitationCenter> list(RehabilitationCenter rehabilitationCenter) {
        startPage();
        List<RehabilitationCenter> list = rehabilitationCenterService.selectRehabilitationCenterList(rehabilitationCenter);
        rehabilitationCenterService.handlerRehabilitationCenterList(list, List.of("lang"));
        return getDataTable(list);
    }

    /**
     * 获取康复中心详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(rehabilitationCenterService.selectRehabilitationCenterById(id));
    }

    /**
     * 新增康复中心
     */
    @Log(title = "康复中心", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody RehabilitationCenter rehabilitationCenter) {
        return toAjax(rehabilitationCenterService.insertRehabilitationCenter(rehabilitationCenter));
    }

    /**
     * 修改康复中心
     */
    @Log(title = "康复中心", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody RehabilitationCenter rehabilitationCenter) {
        return toAjax(rehabilitationCenterService.updateRehabilitationCenter(rehabilitationCenter));
    }

    /**
     * 删除康复中心
     */
    @Log(title = "康复中心", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(rehabilitationCenterService.deleteRehabilitationCenterByIds(ids));
    }
}
