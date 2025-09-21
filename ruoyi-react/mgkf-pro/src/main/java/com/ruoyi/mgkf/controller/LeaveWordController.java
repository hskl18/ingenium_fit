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
import com.ruoyi.mgkf.domain.LeaveWord;
import com.ruoyi.mgkf.service.ILeaveWordService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 留言
 */
@RestController
@RequestMapping("/mgkf/word")
public class LeaveWordController extends BaseController {

    @Autowired
    private ILeaveWordService leaveWordService;

//    /**
//     * 查询留言列表
//     */
//    @GetMapping("/list")
//    public TableDataInfo<LeaveWord> list(LeaveWord leaveWord) {
//        startPage();
//        List<LeaveWord> list = leaveWordService.selectLeaveWordList(leaveWord);
//        leaveWordService.handlerLeaveWordList(list, List.of("selectUserInfo", "selectLatestMessage", "selectUnReadMessageNum"));
//        return getDataTable(list);
//    }
//
//    /**
//     * 获取留言详细信息
//     */
//    @GetMapping(value = "/{id}")
//    public AjaxResult getInfo(@PathVariable("id") Long id) {
//        return success(leaveWordService.selectLeaveWordById(id));
//    }
//
//    /**
//     * 新增留言
//     */
//    @Log(title = "留言", businessType = BusinessType.INSERT)
//    @PostMapping
//    public AjaxResult add(@RequestBody LeaveWord leaveWord) {
//        return toAjax(leaveWordService.insertLeaveWord(leaveWord));
//    }
//
//    /**
//     * 修改留言
//     */
//    @Log(title = "留言", businessType = BusinessType.UPDATE)
//    @PutMapping
//    public AjaxResult edit(@RequestBody LeaveWord leaveWord) {
//        return toAjax(leaveWordService.updateLeaveWord(leaveWord));
//    }
//
//    /**
//     * 删除留言
//     */
//    @Log(title = "留言", businessType = BusinessType.DELETE)
//    @DeleteMapping("/{ids}")
//    public AjaxResult remove(@PathVariable Long[] ids) {
//        return toAjax(leaveWordService.deleteLeaveWordByIds(ids));
//    }
}
