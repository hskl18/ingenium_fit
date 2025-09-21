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
import com.ruoyi.mgkf.domain.ScienceCategory;
import com.ruoyi.mgkf.service.IScienceCategoryService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 科普分类
 */
@RestController
@RequestMapping("/mgkf/science/category")
public class ScienceCategoryController extends BaseController {

    @Autowired
    private IScienceCategoryService scienceCategoryService;

    /**
     * 查询科普分类列表
     */
    @GetMapping("/list")
    public TableDataInfo<ScienceCategory> list(ScienceCategory scienceCategory) {
        startPage();
        List<ScienceCategory> list = scienceCategoryService.selectScienceCategoryList(scienceCategory);
        scienceCategoryService.handlerScienceCategoryList(list, List.of("lang"));
        return getDataTable(list);
    }

    /**
     * 获取科普分类详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(scienceCategoryService.selectScienceCategoryById(id));
    }

    /**
     * 新增科普分类
     */
    @Log(title = "科普分类", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody ScienceCategory scienceCategory) {
        return toAjax(scienceCategoryService.insertScienceCategory(scienceCategory));
    }

    /**
     * 修改科普分类
     */
    @Log(title = "科普分类", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody ScienceCategory scienceCategory) {
        return toAjax(scienceCategoryService.updateScienceCategory(scienceCategory));
    }

    /**
     * 删除科普分类
     */
    @Log(title = "科普分类", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(scienceCategoryService.deleteScienceCategoryByIds(ids));
    }
}
