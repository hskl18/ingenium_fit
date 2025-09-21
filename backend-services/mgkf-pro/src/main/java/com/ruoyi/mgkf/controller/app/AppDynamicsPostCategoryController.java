package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.DynamicsPostCategory;
import com.ruoyi.mgkf.service.IDynamicsPostCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 动态帖子分类
 */
@RestController
@RequestMapping("/app/dynamicsPost/category")
public class AppDynamicsPostCategoryController extends BaseController {
    @Autowired
    private IDynamicsPostCategoryService dynamicsPostCategoryService;

    /**
     * 查询动态帖子分类列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public R<List<DynamicsPostCategory>> list() {
        DynamicsPostCategory dynamicsPostCategory = new DynamicsPostCategory();
        dynamicsPostCategory.setDelFlag(PublicCommon.ENABLE);
        List<DynamicsPostCategory> dynamicsPostCategoryList = dynamicsPostCategoryService.selectDynamicsPostCategoryList(dynamicsPostCategory);
        dynamicsPostCategoryService.handlerDynamicsPostCategoryList(dynamicsPostCategoryList, List.of("lang"));
        return R.ok(dynamicsPostCategoryList);
    }
}
