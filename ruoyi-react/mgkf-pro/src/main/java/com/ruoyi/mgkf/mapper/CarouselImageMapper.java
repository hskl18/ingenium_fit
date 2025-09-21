package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.CarouselImage;

/**
 * 轮播图Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-16
 */
public interface CarouselImageMapper 
{
    /**
     * 查询轮播图
     * 
     * @param id 轮播图主键
     * @return 轮播图
     */
    public CarouselImage selectCarouselImageById(Long id);

    /**
     * 查询轮播图列表
     * 
     * @param carouselImage 轮播图
     * @return 轮播图集合
     */
    public List<CarouselImage> selectCarouselImageList(CarouselImage carouselImage);

    /**
     * 新增轮播图
     * 
     * @param carouselImage 轮播图
     * @return 结果
     */
    public int insertCarouselImage(CarouselImage carouselImage);

    /**
     * 修改轮播图
     * 
     * @param carouselImage 轮播图
     * @return 结果
     */
    public int updateCarouselImage(CarouselImage carouselImage);

    /**
     * 删除轮播图
     * 
     * @param id 轮播图主键
     * @return 结果
     */
    public int deleteCarouselImageById(Long id);

    /**
     * 批量删除轮播图
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteCarouselImageByIds(Long[] ids);
}
