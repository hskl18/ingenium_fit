package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.LeaveWord;
import com.ruoyi.mgkf.domain.LeaveWordSub;
import com.ruoyi.mgkf.domain.UserMessage;
import com.ruoyi.mgkf.service.ILeaveWordService;
import com.ruoyi.mgkf.service.ILeaveWordSubService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 留言
 */
@RestController
@RequestMapping("/app/leave/word")
public class AppLeaveWordController extends BaseController {

    @Autowired
    private ILeaveWordService leaveWordService;

    @Resource
    private ILeaveWordSubService leaveWordSubService;

    @Resource
    private BusinessUtil businessUtil;

    /**
     * 查询留言列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<LeaveWord> list() {
        LeaveWord leaveWord = new LeaveWord();
        leaveWord.setDelFlag(PublicCommon.ENABLE);
        leaveWord.setUserId(businessUtil.getLoginUser().getId());
        startPage();
        List<LeaveWord> list = leaveWordService.selectLeaveWordList(leaveWord);
        leaveWordService.handlerLeaveWordList(list, List.of("selectUserInfo", "selectLatestMessage", "selectUnReadMessageNum"));
        return getDataTable(list);
    }

    /**
     * 获取留言信息
     */
    @PostMapping(value = "/detail")
    @UserLoginToken
    public R<LeaveWord> getInfo(@RequestBody LeaveWord.LeaveWordDetailBo bo) {
        return R.ok(leaveWordService.createAndGetLeaveWordByUserId(bo));
    }

    /**
     * 查询留言内容列表
     */
    @PostMapping("/content/list")
    @UserLoginToken
    public TableDataInfo<LeaveWordSub> list(@RequestBody LeaveWordSub.LeaveWordSubListBo bo) {
        LeaveWordSub leaveWordSub = new LeaveWordSub();
        leaveWordSub.setLeaveWordId(bo.getLeaveWordId());
        leaveWordSub.setDelFlag(PublicCommon.ENABLE);
        startPage();
        List<LeaveWordSub> list = leaveWordSubService.selectLeaveWordSubList(leaveWordSub);
        leaveWordSubService.handlerLeaveWordSubList(list, List.of("selectUserInfo"));
        return getDataTable(list);
    }

    /**
     * 发送留言
     */
    @PostMapping("/content/send")
    @UserLoginToken
    public R<Void> add(@RequestBody LeaveWordSub.LeaveWordSubBo bo) {
        LeaveWordSub leaveWordSub = new LeaveWordSub();
        leaveWordSub.setLeaveWordId(bo.getLeaveWordId());
        leaveWordSub.setSendUserId(businessUtil.getLoginUser().getId());
        leaveWordSub.setMessageType(bo.getMessageType());
        leaveWordSub.setMessageContent(bo.getMessageContent());
        leaveWordSub.setDuration(bo.getDuration());
        leaveWordSub.setCreateTime(DateUtils.getNowDate());
        leaveWordSubService.insertLeaveWordSub(leaveWordSub);
        return R.ok();
    }

    /**
     * 查询未读消息数量和最新一条消息
     */
    @PostMapping("/unReadNumAndLatest")
    public R<LeaveWord> unReadNumAndLatest() {
        return R.ok(leaveWordService.unReadNumAndLatest(businessUtil.getLoginUser().getId()));
    }
}
