package com.ruoyi.mgkf.controller.app;

import cn.hutool.core.collection.CollectionUtil;
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
import com.ruoyi.mgkf.domain.RehabilitationCenter;
import com.ruoyi.mgkf.service.IRehabilitationCenterService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 康复中心
 */
@RestController
@RequestMapping("/app/center")
public class AppRehabilitationCenterController extends BaseController {
    @Autowired
    private IRehabilitationCenterService rehabilitationCenterService;

    /**
     * 查询康复中心列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<RehabilitationCenter> list(@RequestBody RehabilitationCenter.RehabilitationCenterListBo bo) {
        RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
        rehabilitationCenter.setDelFlag(PublicCommon.ENABLE);
        rehabilitationCenter.setSearchKey(bo.getSearchKey());
        rehabilitationCenter.setOrderByType(bo.getOrderByType() != null ? bo.getOrderByType() : 1);
        rehabilitationCenter.setMinScore(bo.getMinScore());
        rehabilitationCenter.setMaxScore(bo.getMaxScore());
        rehabilitationCenter.setMinDistance(bo.getMinDistance());
        rehabilitationCenter.setMaxDistance(bo.getMaxDistance());
        rehabilitationCenter.setClientLongitude(bo.getLongitude());
        rehabilitationCenter.setClientLatitude(bo.getLatitude());
        startPage();
        List<RehabilitationCenter> list =
            rehabilitationCenterService.selectRehabilitationCenterList(rehabilitationCenter);
        rehabilitationCenterService.handlerRehabilitationCenterList(list, List.of("lang", "whetherFavorite"));
        return getDataTable(list);
    }

    /**
     * 获取康复中心详细信息
     */
    @PostMapping(value = "/detail")
    @UserLoginToken
    public R<RehabilitationCenter> getInfo(@RequestBody RehabilitationCenter.RehabilitationCenterDetailBo bo) {
        RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
        rehabilitationCenter.setDelFlag(PublicCommon.ENABLE);
        rehabilitationCenter.setId(bo.getId());
        rehabilitationCenter.setClientLongitude(bo.getLongitude());
        rehabilitationCenter.setClientLatitude(bo.getLatitude());
        List<RehabilitationCenter> list = rehabilitationCenterService.selectRehabilitationCenterList(rehabilitationCenter);
        rehabilitationCenterService.handlerRehabilitationCenterList(list, List.of("lang", "whetherFavorite"));
        return R.ok(CollectionUtil.isNotEmpty(list) ? list.get(0) : null);
    }

}
