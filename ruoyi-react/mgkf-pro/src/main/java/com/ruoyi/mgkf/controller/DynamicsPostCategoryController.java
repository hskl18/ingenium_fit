package com.ruoyi.mgkf.controller;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.DynamicsPostCategory;
import com.ruoyi.mgkf.service.IDynamicsPostCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 动态帖子分类
 */
@RestController
@RequestMapping("/mgkf/dynamicsPost/category")
public class DynamicsPostCategoryController extends BaseController {

    @Autowired
    private IDynamicsPostCategoryService dynamicsPostCategoryService;

    /**
     * 查询动态帖子分类列表
     */
    @GetMapping("/list")
    public TableDataInfo<DynamicsPostCategory> list(DynamicsPostCategory dynamicsPostCategory) {
        startPage();
        List<DynamicsPostCategory> list = dynamicsPostCategoryService.selectDynamicsPostCategoryList(dynamicsPostCategory);
        dynamicsPostCategoryService.handlerDynamicsPostCategoryList(list, List.of("lang"));
        return getDataTable(list);
    }

    /**
     * 获取动态帖子分类详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(dynamicsPostCategoryService.selectDynamicsPostCategoryById(id));
    }

    /**
     * 新增动态帖子分类
     */
    @Log(title = "动态帖子分类", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody DynamicsPostCategory dynamicsPostCategory) {
        return toAjax(dynamicsPostCategoryService.insertDynamicsPostCategory(dynamicsPostCategory));
    }

    /**
     * 修改动态帖子分类
     */
    @Log(title = "动态帖子分类", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody DynamicsPostCategory dynamicsPostCategory) {
        return toAjax(dynamicsPostCategoryService.updateDynamicsPostCategory(dynamicsPostCategory));
    }

    /**
     * 删除动态帖子分类
     */
    @Log(title = "动态帖子分类", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(dynamicsPostCategoryService.deleteDynamicsPostCategoryByIds(ids));
    }
}
