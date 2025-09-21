package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.UserComment;
import com.ruoyi.mgkf.domain.UserCommentReply;
import com.ruoyi.mgkf.service.*;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户评论
 */
@RestController
@RequestMapping("/app/comment")
public class AppUserCommentController extends BaseController {
    @Autowired
    private IUserCommentService userCommentService;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IRehabilitationCenterService rehabilitationCenterService;

    @Resource
    private IDoctorService doctorService;

    @Resource
    private IUserCommentReplyService userCommentReplyService;

    @Resource
    private IDynamicsPostService dynamicsPostService;

    @Resource
    private IScienceService scienceService;

    /**
     * 查询用户评论列表
     */
    @PostMapping("/list")
    public TableDataInfo<UserComment> list(@RequestBody UserComment.UserCommentListBo bo) {
        UserComment userComment = new UserComment();
        userComment.setDelFlag(PublicCommon.ENABLE);
        userComment.setObjectId(bo.getObjectId());
        userComment.setObjectType(bo.getObjectType());
        startPage();
        List<UserComment> list = userCommentService.selectUserCommentList(userComment);
        userCommentService.handlerUserCommentList(list, List.of("selectUserInfo", "selectReplyComment"));
        return getDataTable(list);
    }

    /**
     * 新增用户评论
     */
    @PostMapping
    @UserLoginToken
    public R<Void> add(@RequestBody UserComment.UserCommentBo bo) {
        Long objectType = bo.getObjectType();
        Long objectId = bo.getObjectId();
        UserComment userComment = new UserComment();
        userComment.setUserId(businessUtil.getLoginUser().getId());
        userComment.setContent(bo.getContent());
        userComment.setImages(bo.getImages());
        userComment.setObjectType(objectType);
        userComment.setObjectId(objectId);
        userComment.setStar(bo.getStar());
        userComment.setCreateTime(DateUtils.getNowDate());
        if (userCommentService.insertUserComment(userComment) > 0) {
            userCommentService.updateCommentNum(objectType, objectId);
        }
        return R.ok();
    }

    /**
     * 新增评论回复
     */
    @PostMapping("/add/reply")
    @UserLoginToken
    public R<Void> add(@RequestBody UserCommentReply.UserCommentReplyBo bo) {
        UserCommentReply userCommentReply = new UserCommentReply();
        userCommentReply.setUserCommentId(bo.getUserCommentId());
        userCommentReply.setContent(bo.getContent());
        userCommentReply.setUserId(businessUtil.getLoginUser().getId());
        userCommentReply.setReplyUserId(bo.getReplyUserId());
        userCommentReply.setCreateTime(DateUtils.getNowDate());
        userCommentReplyService.insertUserCommentReply(userCommentReply);

        // 查询评论
        UserComment userComment = userCommentService.selectUserCommentById(userCommentReply.getUserCommentId());
        if (userComment != null) {
            Long objectType = userComment.getObjectType();
            Long objectId = userComment.getObjectId();
            userCommentService.updateCommentNum(objectType, objectId);
        }
        return R.ok();
    }
}
