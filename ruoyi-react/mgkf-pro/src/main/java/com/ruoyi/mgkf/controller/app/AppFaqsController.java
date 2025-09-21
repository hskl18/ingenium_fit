package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.Faqs;
import com.ruoyi.mgkf.service.IFaqsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 常见问题
 */
@RestController
@RequestMapping("/app/faqs")
public class AppFaqsController extends BaseController {

    @Autowired
    private IFaqsService faqsService;

    /**
     * 查询常见问题列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public R<List<Faqs>> list(@RequestBody Faqs.FaqsListBo bo) {
        Faqs faqs = new Faqs();
        faqs.setDelFlag(PublicCommon.ENABLE);
        faqs.setSearchKey(bo.getSearchKey());
        List<Faqs> list = faqsService.selectFaqsList(faqs);
        faqsService.handlerFaqsList(list, List.of("lang"));
        return R.ok(list);
    }
}
