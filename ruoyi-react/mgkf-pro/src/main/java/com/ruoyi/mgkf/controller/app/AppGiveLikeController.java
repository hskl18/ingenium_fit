package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.GiveLike;
import com.ruoyi.mgkf.service.IGiveLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 点赞
 */
@RestController
@RequestMapping("/app/like")
public class AppGiveLikeController extends BaseController {

    @Autowired
    private IGiveLikeService giveLikeService;

    /**
     * 点赞/取消点赞
     */
    @PostMapping
    @UserLoginToken
    public R<Void> add(@RequestBody GiveLike.GiveLikeBo bo) {
        giveLikeService.addGiveLike(bo);
        return R.ok();
    }
}
