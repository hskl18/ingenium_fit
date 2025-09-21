package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.Favorite;
import com.ruoyi.mgkf.service.IFavoriteService;
import com.ruoyi.mgkf.service.IRehabilitationCenterService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 收藏
 */
@RestController
@RequestMapping("/app/favorite")
public class AppFavoriteController extends BaseController {
    @Autowired
    private IFavoriteService favoriteService;

    @Resource
    private BusinessUtil businessUtil;

    /**
     * 查询收藏列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<Favorite> list(@RequestBody Favorite.FavoriteListBo bo) {
        Favorite favorite = new Favorite();
        favorite.setDelFlag(PublicCommon.ENABLE);
        favorite.setObjectType(bo.getObjectType());
        favorite.setUserId(businessUtil.getLoginUser().getId());
        startPage();
        List<Favorite> list = favoriteService.selectFavoriteList(favorite);
        favorite.setLatitude(bo.getLatitude());
        favorite.setLongitude(bo.getLongitude());
        // 收藏对象类型：1-康复中心 2-科普 3-动态
        if (bo.getObjectType() == 1) {
            favoriteService.handlerFavoriteList(list, List.of("selectRehabilitationCenterInfo"), favorite);
        } else if (bo.getObjectType() == 2) {
            favoriteService.handlerFavoriteList(list, List.of("selectScienceInfo"), favorite);
        } else {
            favoriteService.handlerFavoriteList(list, List.of("selectDynamicsPostInfo"), favorite);
        }
        return getDataTable(list);
    }

    /**
     * 收藏/取消收藏
     */
    @PostMapping
    @UserLoginToken
    public R<Void> add(@RequestBody Favorite.FavoriteBo bo) {
        favoriteService.addFavorite(bo);
        return R.ok();
    }
}
