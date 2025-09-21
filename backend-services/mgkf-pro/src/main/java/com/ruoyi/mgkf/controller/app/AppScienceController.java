package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.IdBo;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.Science;
import com.ruoyi.mgkf.service.IScienceService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 科普
 */
@RestController
@RequestMapping("/app/science")
public class AppScienceController extends BaseController
{
    @Autowired
    private IScienceService scienceService;

    /**
     * 查询科普列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<Science> list(@RequestBody Science.ScienceListBo bo)
    {
        Science science = new Science();
        science.setWhetherRecommend(bo.getWhetherRecommend());
        science.setDelFlag(PublicCommon.ENABLE);
        science.setScienceCategoryId(bo.getScienceCategoryId());
        science.setSearchKey(bo.getSearchKey());
        startPage();
        List<Science> list = scienceService.selectScienceList(science);
        scienceService.handlerScienceList(list, List.of("lang", "selectScienceCategoryInfo"));
        return getDataTable(list);
    }

    /**
     * 获取科普详细信息
     */
    @PostMapping(value = "/detail")
    @UserLoginToken
    public R<Science> getInfo(@RequestBody IdBo bo)
    {
        Science science = scienceService.selectScienceById(bo.getId());
        if (science != null) {
            scienceService.handlerScienceList(List.of(science), List.of("lang", "whetherFavorite"));
        }
        return R.ok(science);
    }
}
