package com.ruoyi.mgkf.controller;

import java.util.ArrayList;
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
import com.ruoyi.mgkf.domain.UserCommentReply;
import com.ruoyi.mgkf.service.IUserCommentReplyService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 评论回复
 */
@RestController
@RequestMapping("/mgkf/reply")
public class UserCommentReplyController extends BaseController {

    @Autowired
    private IUserCommentReplyService userCommentReplyService;

    /**
     * 查询评论回复列表
     */
    @GetMapping("/list")
    public TableDataInfo<UserCommentReply> list(UserCommentReply userCommentReply) {
        startPage();
        List<UserCommentReply> list = userCommentReplyService.selectUserCommentReplyList(userCommentReply);
        userCommentReplyService.handlerUserCommentReplyList(list, List.of("selectUserInfo"));
        return getDataTable(list);
    }

    /**
     * 获取评论回复详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        UserCommentReply userCommentReply = userCommentReplyService.selectUserCommentReplyById(id);
        if (userCommentReply != null) {
            userCommentReplyService.handlerUserCommentReplyList(List.of(userCommentReply), List.of("selectUserInfo"));
        }
        return success(userCommentReply);
    }

    /**
     * 新增评论回复
     */
    @Log(title = "评论回复", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody UserCommentReply userCommentReply) {
        return toAjax(userCommentReplyService.insertUserCommentReply(userCommentReply));
    }

    /**
     * 修改评论回复
     */
    @Log(title = "评论回复", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody UserCommentReply userCommentReply) {
        return toAjax(userCommentReplyService.updateUserCommentReply(userCommentReply));
    }

    /**
     * 删除评论回复
     */
    @Log(title = "评论回复", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(userCommentReplyService.deleteUserCommentReplyByIds(ids));
    }
}
