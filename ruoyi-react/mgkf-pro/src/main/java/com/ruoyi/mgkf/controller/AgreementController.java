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
import com.ruoyi.mgkf.domain.Agreement;
import com.ruoyi.mgkf.service.IAgreementService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 协议
 */
@RestController
@RequestMapping("/mgkf/agreement")
public class AgreementController extends BaseController {
    @Autowired
    private IAgreementService agreementService;

    /**
     * 查询协议列表
     */
    @GetMapping("/list")
    public TableDataInfo<Agreement> list(Agreement agreement) {
        startPage();
        List<Agreement> list = agreementService.selectAgreementList(agreement);
        return getDataTable(list);
    }

    /**
     * 获取协议详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(agreementService.selectAgreementById(id));
    }

    /**
     * 新增协议
     */
    @Log(title = "协议", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody Agreement agreement) {
        return toAjax(agreementService.insertAgreement(agreement));
    }

    /**
     * 修改协议
     */
    @Log(title = "协议", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody Agreement agreement) {
        return toAjax(agreementService.updateAgreement(agreement));
    }

    /**
     * 删除协议
     */
    @Log(title = "协议", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(agreementService.deleteAgreementByIds(ids));
    }
}
