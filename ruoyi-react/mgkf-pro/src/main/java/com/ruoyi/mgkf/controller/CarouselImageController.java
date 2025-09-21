package com.ruoyi.mgkf.controller;

import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.CarouselImage;
import com.ruoyi.mgkf.service.ICarouselImageService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 轮播图
 */
@RestController
@RequestMapping("/mgkf/image")
public class CarouselImageController extends BaseController {

    @Autowired
    private ICarouselImageService carouselImageService;

    /**
     * 查询轮播图列表
     */
    @GetMapping("/list")
    public TableDataInfo<CarouselImage> list(CarouselImage carouselImage) {
        startPage();
        List<CarouselImage> list = carouselImageService.selectCarouselImageList(carouselImage);
        carouselImageService.handlerCarouselImageList(list, List.of("selectObject"));
        return getDataTable(list);
    }

    /**
     * 获取轮播图详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        CarouselImage carouselImage = carouselImageService.selectCarouselImageById(id);
        if (carouselImage != null) {
            carouselImageService.handlerCarouselImageList(List.of(carouselImage), List.of("selectObject"));
        }
        return success(carouselImage);
    }

    /**
     * 新增轮播图
     */
    @Log(title = "轮播图", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody CarouselImage carouselImage) {
        return toAjax(carouselImageService.insertCarouselImage(carouselImage));
    }

    /**
     * 修改轮播图
     */
    @Log(title = "轮播图", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody CarouselImage carouselImage) {
        return toAjax(carouselImageService.updateCarouselImage(carouselImage));
    }

    /**
     * 删除轮播图
     */
    @Log(title = "轮播图", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(carouselImageService.deleteCarouselImageByIds(ids));
    }
}
