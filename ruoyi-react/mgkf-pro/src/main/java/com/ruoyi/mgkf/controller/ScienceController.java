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
import com.ruoyi.mgkf.domain.Science;
import com.ruoyi.mgkf.service.IScienceService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 科普
 */
@RestController
@RequestMapping("/mgkf/science")
public class ScienceController extends BaseController {

    @Autowired
    private IScienceService scienceService;

    /**
     * 查询科普列表
     */
    @GetMapping("/list")
    public TableDataInfo<Science> list(Science science) {
        startPage();
        List<Science> list = scienceService.selectScienceList(science);
        scienceService.handlerScienceList(list, List.of("selectScienceCategoryInfo"));
        return getDataTable(list);
    }

    /**
     * 获取科普详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        Science science = scienceService.selectScienceById(id);
        if (science != null) {
            scienceService.handlerScienceList(List.of(science), List.of("selectScienceCategoryInfo", "selectCommentCount"));
        }
        return success(science);
    }

    /**
     * 新增科普
     */
    @Log(title = "科普", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody Science science) {
        return toAjax(scienceService.insertScience(science));
    }

    /**
     * 修改科普
     */
    @Log(title = "科普", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody Science science) {
        return toAjax(scienceService.updateScience(science));
    }

    /**
     * 删除科普
     */
    @Log(title = "科普", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(scienceService.deleteScienceByIds(ids));
    }
}
