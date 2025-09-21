package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.IdBo;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.CarouselImage;
import com.ruoyi.mgkf.service.ICarouselImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 轮播图
 */
@RestController
@RequestMapping("/app/image")
public class AppCarouselImageController extends BaseController {
    @Autowired
    private ICarouselImageService carouselImageService;

    /**
     * 查询轮播图列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public R<List<CarouselImage>> list() {
        CarouselImage carouselImage = new CarouselImage();
        carouselImage.setDelFlag(PublicCommon.ENABLE);
        List<CarouselImage> list = carouselImageService.selectCarouselImageList(carouselImage);
        carouselImageService.handlerCarouselImageList(list, List.of("lang"));
        return R.ok(list);
    }

    /**
     * 获取轮播图详细信息
     */
    @PostMapping(value = "/detail")
    @UserLoginToken
    public R<CarouselImage> getInfo(@RequestBody IdBo bo) {
        CarouselImage carouselImage = carouselImageService.selectCarouselImageById(bo.getId());
        if (carouselImage != null) {
            carouselImageService.handlerCarouselImageList(List.of(carouselImage), List.of("lang"));
        }
        return R.ok(carouselImage);
    }
}
