package com.ruoyi.mgkf.controller.app;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.domain.Agreement;
import com.ruoyi.mgkf.service.IAgreementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 协议控制器
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/app/agreement")
public class AppAgreementController {

    private final IAgreementService agreementService;

    /**
     * 获取协议
     */
    @PostMapping("/getByCode")
    public R<Agreement> getByCode(@RequestBody Agreement bo) {
        List<Agreement> agreementList = agreementService.selectAgreementList(bo);
        agreementService.handlerAgreementList(agreementList, List.of("lang"));
        return R.ok(CollectionUtil.isNotEmpty(agreementList) ? agreementList.get(0) : null);
    }

    /**
     * 获取协议内容
     */
    @PostMapping("/getContentByCode")
    public String getContentByCode(@RequestBody Agreement bo) {
        List<Agreement> agreementList = agreementService.selectAgreementList(bo);
        agreementService.handlerAgreementList(agreementList, List.of("lang"));
        return CollectionUtil.isNotEmpty(agreementList) ? agreementList.get(0).getContent() : "";
    }

    /**
     * 获取协议内容
     */
    @GetMapping("/getAgreement/{code}")
    public String getAgreement(@PathVariable String code) {
        Agreement bo = new Agreement();
        bo.setCode(code);
        List<Agreement> agreementList = agreementService.selectAgreementList(bo);
        agreementService.handlerAgreementList(agreementList, List.of("lang"));
        return CollectionUtil.isNotEmpty(agreementList) ? agreementList.get(0).getContent() : "";
    }
}
