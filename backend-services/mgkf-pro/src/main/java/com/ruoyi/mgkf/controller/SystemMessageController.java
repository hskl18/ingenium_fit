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
import com.ruoyi.mgkf.domain.SystemMessage;
import com.ruoyi.mgkf.service.ISystemMessageService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 系统消息
 */
@RestController
@RequestMapping("/mgkf/message")
public class SystemMessageController extends BaseController {

    @Autowired
    private ISystemMessageService systemMessageService;

    /**
     * 查询系统消息列表
     */
    @GetMapping("/list")
    public TableDataInfo<SystemMessage> list(SystemMessage systemMessage) {
        startPage();
        List<SystemMessage> list = systemMessageService.selectSystemMessageList(systemMessage);
        return getDataTable(list);
    }

    /**
     * 获取系统消息详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(systemMessageService.selectSystemMessageById(id));
    }

    /**
     * 新增系统消息
     */
    @Log(title = "系统消息", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody SystemMessage systemMessage) {
        return toAjax(systemMessageService.insertSystemMessage(systemMessage));
    }

    /**
     * 修改系统消息
     */
    @Log(title = "系统消息", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody SystemMessage systemMessage) {
        return toAjax(systemMessageService.updateSystemMessage(systemMessage));
    }

    /**
     * 删除系统消息
     */
    @Log(title = "系统消息", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(systemMessageService.deleteSystemMessageByIds(ids));
    }
}
