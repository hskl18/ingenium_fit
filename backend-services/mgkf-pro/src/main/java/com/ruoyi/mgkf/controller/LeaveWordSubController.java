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
import com.ruoyi.mgkf.domain.LeaveWordSub;
import com.ruoyi.mgkf.service.ILeaveWordSubService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 留言内容
 */
@RestController
@RequestMapping("/mgkf/sub")
public class LeaveWordSubController extends BaseController {

    @Autowired
    private ILeaveWordSubService leaveWordSubService;

    /**
     * 查询留言子列表
     */
    @GetMapping("/list")
    public TableDataInfo<LeaveWordSub> list(LeaveWordSub leaveWordSub) {
        startPage();
        List<LeaveWordSub> list = leaveWordSubService.selectLeaveWordSubList(leaveWordSub);
        leaveWordSubService.handlerLeaveWordSubList(list, List.of("selectUserInfo"));
        return getDataTable(list);
    }

    /**
     * 获取留言子详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        LeaveWordSub leaveWordSub = leaveWordSubService.selectLeaveWordSubById(id);
        if (leaveWordSub != null) {
            leaveWordSubService.handlerLeaveWordSubList(List.of(leaveWordSub), List.of("selectUserInfo"));
        }
        return success(leaveWordSub);
    }

    /**
     * 新增留言子
     */
    @Log(title = "留言子", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody LeaveWordSub leaveWordSub) {
        return toAjax(leaveWordSubService.insertLeaveWordSub(leaveWordSub));
    }

    /**
     * 修改留言子
     */
    @Log(title = "留言子", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody LeaveWordSub leaveWordSub) {
        return toAjax(leaveWordSubService.updateLeaveWordSub(leaveWordSub));
    }

    /**
     * 删除留言子
     */
    @Log(title = "留言子", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(leaveWordSubService.deleteLeaveWordSubByIds(ids));
    }
}
