package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.ScienceCategory;
import com.ruoyi.mgkf.service.IScienceCategoryService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 科普分类
 */
@RestController
@RequestMapping("/app/science/category")
public class AppScienceCategoryController extends BaseController
{
    @Autowired
    private IScienceCategoryService scienceCategoryService;

    /**
     * 查询科普分类列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public R<List<ScienceCategory>> list()
    {
        ScienceCategory scienceCategory = new ScienceCategory();
        scienceCategory.setDelFlag(PublicCommon.ENABLE);
        List<ScienceCategory> scienceCategoryList = scienceCategoryService.selectScienceCategoryList(scienceCategory);
        scienceCategoryService.handlerScienceCategoryList(scienceCategoryList, List.of("lang"));
        return R.ok(scienceCategoryList);
    }
}
