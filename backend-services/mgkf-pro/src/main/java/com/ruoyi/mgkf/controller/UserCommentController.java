package com.ruoyi.mgkf.controller;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.UserComment;
import com.ruoyi.mgkf.service.IDoctorService;
import com.ruoyi.mgkf.service.IDynamicsPostService;
import com.ruoyi.mgkf.service.IRehabilitationCenterService;
import com.ruoyi.mgkf.service.IUserCommentService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户评论
 */
@RestController
@RequestMapping("/mgkf/comment")
public class UserCommentController extends BaseController {

    @Autowired
    private IUserCommentService userCommentService;

    @Resource
    private IRehabilitationCenterService rehabilitationCenterService;

    @Resource
    private IDoctorService doctorService;

    @Resource
    private IDynamicsPostService dynamicsPostService;

    /**
     * 查询用户评论列表
     */
    @GetMapping("/list")
    public TableDataInfo<UserComment> list(UserComment userComment) {
        startPage();
        List<UserComment> list = userCommentService.selectUserCommentList(userComment);
        userCommentService.handlerUserCommentList(list, List.of("selectRehabilitationCenterInfo", "selectScienceInfo", "selectDynamicsPostInfo", "selectDoctorInfo", "selectUserInfo"));
        return getDataTable(list);
    }

    /**
     * 获取用户评论详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        UserComment userComment = userCommentService.selectUserCommentById(id);
        if (userComment != null) {
            userCommentService.handlerUserCommentList(List.of(userComment), List.of("selectRehabilitationCenterInfo", "selectScienceInfo", "selectDynamicsPostInfo", "selectDoctorInfo", "selectUserInfo"));
        }
        return success(userComment);
    }

    /**
     * 新增用户评论
     */
    @Log(title = "用户评论", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody UserComment userComment) {
        int updateRow = userCommentService.insertUserComment(userComment);
        if (updateRow > 0) {
            Long objectType = userComment.getObjectType();
            Long objectId = userComment.getObjectId();
            userCommentService.updateCommentNum(objectType, objectId);
        }
        return toAjax(updateRow);
    }

    /**
     * 修改用户评论
     */
    @Log(title = "用户评论", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody UserComment userComment) {
        return toAjax(userCommentService.updateUserComment(userComment));
    }

    /**
     * 删除用户评论
     */
    @Log(title = "用户评论", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        int updateRow = userCommentService.deleteUserCommentByIds(ids);
        return toAjax(updateRow);
    }
}
