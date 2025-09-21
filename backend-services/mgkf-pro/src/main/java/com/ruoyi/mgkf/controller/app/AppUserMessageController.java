package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.IdBo;
import com.ruoyi.mgkf.domain.UserMessage;
import com.ruoyi.mgkf.service.IUserMessageService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户消息
 */
@RestController
@RequestMapping("/app/user/message")
public class AppUserMessageController extends BaseController {

    @Autowired
    private IUserMessageService userMessageService;

    @Resource
    private BusinessUtil businessUtil;

    /**
     * 查询未读消息数量和最新一条消息
     */
    @PostMapping("/unReadNumAndLatest")
    public R<UserMessage> unReadNumAndLatest() {
        return R.ok(userMessageService.unReadNumAndLatest(businessUtil.getLoginUser().getId()));
    }

    /**
     * 查询用户消息列表
     */
    @PostMapping("/list")
    public TableDataInfo<UserMessage> list() {
        UserMessage userMessage = new UserMessage();
        userMessage.setDelFlag(PublicCommon.ENABLE);
        userMessage.setUserId(businessUtil.getLoginUser().getId());
        startPage();
        List<UserMessage> list = userMessageService.selectUserMessageList(userMessage);
        userMessageService.handlerUserMessageList(list, List.of("lang"));
        return getDataTable(list);
    }

    /**
     * 获取用户消息详细信息
     */
    @PostMapping(value = "/detail")
    public R<UserMessage> getInfo(@RequestBody IdBo bo) {
        UserMessage userMessage = userMessageService.selectUserMessageById(bo.getId());
        if (userMessage != null) {
            userMessageService.handlerUserMessageList(List.of(userMessage), List.of("lang"));
        }
        return R.ok(userMessage);
    }

    /**
     * 删除用户消息
     */
    @PostMapping("/delete")
    public R<Void> remove(@RequestBody IdBo bo) {
        userMessageService.deleteUserMessageByIds(new Long[]{bo.getId()});
        return R.ok();
    }

    /**
     * 一键已读消息
     */
    @PostMapping("/oneClickRead")
    public R<Void> oneClickRead(@RequestBody IdBo bo) {
        if (bo.getId() == null) {
            userMessageService.updateReadByUserId(businessUtil.getLoginUser().getId());
        } else {
            UserMessage userMessage = new UserMessage();
            userMessage.setId(bo.getId());
            userMessage.setIsRead(1L);
            userMessageService.updateUserMessage(userMessage);
        }
        return R.ok();
    }
}
