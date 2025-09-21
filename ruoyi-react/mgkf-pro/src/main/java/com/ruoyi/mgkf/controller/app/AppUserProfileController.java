package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.DynamicsPost;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IDynamicsPostService;
import com.ruoyi.mgkf.service.IFavoriteService;
import com.ruoyi.mgkf.service.IFollowService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 用户个人资料
 */
@RestController
@RequestMapping("/app/user/profile")
public class AppUserProfileController extends BaseController {
    @Resource
    private IFavoriteService favoriteService;

    @Resource
    private IFollowService followService;

    @Resource
    private BusinessUtil businessUtil;

    /**
     * 查询统计数量
     */
    @PostMapping("/count")
    @UserLoginToken
    public R<User> list() {
        Long loginUserId = businessUtil.getLoginUser().getId();
        User user = new User();
        user.setCollectionNum(favoriteService.selectUserCollectionNum(loginUserId));
        user.setFollowingNum(followService.selectFollowingNum(loginUserId));
        user.setFollowersNum(followService.selectFollowersNum(loginUserId));
        return R.ok(user);
    }
}
