package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.PopularSearchTerms;
import com.ruoyi.mgkf.service.IPopularSearchTermsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 热门搜索词
 */
@RestController
@RequestMapping("/app/terms")
public class AppPopularSearchTermsController extends BaseController {

    @Autowired
    private IPopularSearchTermsService popularSearchTermsService;

    /**
     * 查询热门搜索词列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public R<List<PopularSearchTerms>> list() {
        PopularSearchTerms popularSearchTerms = new PopularSearchTerms();
        popularSearchTerms.setDelFlag(PublicCommon.ENABLE);
        List<PopularSearchTerms> popularSearchTermsList = popularSearchTermsService.selectPopularSearchTermsList(popularSearchTerms);
        popularSearchTermsService.handlerPopularSearchTermsList(popularSearchTermsList, List.of("lang"));
        return R.ok(popularSearchTermsList);
    }
}
