package com.ruoyi.mgkf.controller;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.PopularSearchTerms;
import com.ruoyi.mgkf.service.IPopularSearchTermsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 热门搜索词
 */
@RestController
@RequestMapping("/mgkf/terms")
public class PopularSearchTermsController extends BaseController {

    @Autowired
    private IPopularSearchTermsService popularSearchTermsService;

    /**
     * 查询热门搜索词列表
     */
    @GetMapping("/list")
    public TableDataInfo<PopularSearchTerms> list(PopularSearchTerms popularSearchTerms) {
        startPage();
        List<PopularSearchTerms> list = popularSearchTermsService.selectPopularSearchTermsList(popularSearchTerms);
        return getDataTable(list);
    }

    /**
     * 获取热门搜索词详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(popularSearchTermsService.selectPopularSearchTermsById(id));
    }

    /**
     * 新增热门搜索词
     */
    @Log(title = "热门搜索词", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody PopularSearchTerms popularSearchTerms) {
        return toAjax(popularSearchTermsService.insertPopularSearchTerms(popularSearchTerms));
    }

    /**
     * 修改热门搜索词
     */
    @Log(title = "热门搜索词", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody PopularSearchTerms popularSearchTerms) {
        return toAjax(popularSearchTermsService.updatePopularSearchTerms(popularSearchTerms));
    }

    /**
     * 删除热门搜索词
     */
    @Log(title = "热门搜索词", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(popularSearchTermsService.deletePopularSearchTermsByIds(ids));
    }
}
