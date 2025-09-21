package com.ruoyi.mgkf.controller;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.Faqs;
import com.ruoyi.mgkf.service.IFaqsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 常见问题
 */
@RestController
@RequestMapping("/mgkf/faqs")
public class FaqsController extends BaseController {

    @Autowired
    private IFaqsService faqsService;

    /**
     * 查询常见问题列表
     */
    @GetMapping("/list")
    public TableDataInfo<Faqs> list(Faqs faqs) {
        startPage();
        List<Faqs> list = faqsService.selectFaqsList(faqs);
        return getDataTable(list);
    }

    /**
     * 获取常见问题详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(faqsService.selectFaqsById(id));
    }

    /**
     * 新增常见问题
     */
    @Log(title = "常见问题", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody Faqs faqs) {
        return toAjax(faqsService.insertFaqs(faqs));
    }

    /**
     * 修改常见问题
     */
    @Log(title = "常见问题", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody Faqs faqs) {
        return toAjax(faqsService.updateFaqs(faqs));
    }

    /**
     * 删除常见问题
     */
    @Log(title = "常见问题", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(faqsService.deleteFaqsByIds(ids));
    }
}
