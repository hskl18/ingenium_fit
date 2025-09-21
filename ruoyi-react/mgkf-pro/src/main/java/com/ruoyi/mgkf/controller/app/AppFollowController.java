package com.ruoyi.mgkf.controller.app;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.NumberUtil;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.Follow;
import com.ruoyi.mgkf.service.IFollowService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 关注
 */
@RestController
@RequestMapping("/app/follow")
public class AppFollowController extends BaseController {
    @Autowired
    private IFollowService followService;

    @Resource
    private BusinessUtil businessUtil;

    /**
     * 查询关注列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<Follow> list(@RequestBody Follow.FollowListBo bo) {
        Long loginUserId = businessUtil.getLoginUser().getId();
        Follow follow = new Follow();
        follow.setDelFlag(PublicCommon.ENABLE);
        Integer listType = Convert.toInt(bo.getListType(), 1); // 列表类型 1 关注列表 2 粉丝列表
        if (listType == 1) {
            follow.setUserId(loginUserId);
        } else {
            follow.setFollowUserId(loginUserId);
        }
        startPage();
        List<Follow> list = followService.selectFollowList(follow);
        followService.handlerFollowList(list, listType == 1 ? List.of("selectFollowUserInfo", "mutualFollow") :
            List.of("selectFansUserInfo", "mutualFollow"));
        return getDataTable(list);
    }

    /**
     * 新增/取消关注
     */
    @PostMapping
    @UserLoginToken
    public R<Void> add(@RequestBody @Valid Follow.FollowBo bo) {
        followService.addFollow(bo);
        return R.ok();
    }
}
