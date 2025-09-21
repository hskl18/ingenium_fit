package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.mgkf.domain.DynamicsPost;
import com.ruoyi.mgkf.domain.Science;
import com.ruoyi.mgkf.service.IDynamicsPostService;
import com.ruoyi.mgkf.service.IScienceService;
import com.ruoyi.system.util.LanguageUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.CarouselImageMapper;
import com.ruoyi.mgkf.domain.CarouselImage;
import com.ruoyi.mgkf.service.ICarouselImageService;

/**
 * 轮播图Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-16
 */
@Service
public class CarouselImageServiceImpl implements ICarouselImageService 
{
    @Autowired
    private CarouselImageMapper carouselImageMapper;

    @Resource
    private IScienceService scienceService;

    @Resource
    private IDynamicsPostService dynamicsPostService;

    /**
     * 查询轮播图
     * 
     * @param id 轮播图主键
     * @return 轮播图
     */
    @Override
    public CarouselImage selectCarouselImageById(Long id)
    {
        return carouselImageMapper.selectCarouselImageById(id);
    }

    /**
     * 查询轮播图列表
     * 
     * @param carouselImage 轮播图
     * @return 轮播图
     */
    @Override
    public List<CarouselImage> selectCarouselImageList(CarouselImage carouselImage)
    {
        return carouselImageMapper.selectCarouselImageList(carouselImage);
    }

    /**
     * 新增轮播图
     * 
     * @param carouselImage 轮播图
     * @return 结果
     */
    @Override
    public int insertCarouselImage(CarouselImage carouselImage)
    {
        carouselImage.setCreateTime(DateUtils.getNowDate());
        return carouselImageMapper.insertCarouselImage(carouselImage);
    }

    /**
     * 修改轮播图
     * 
     * @param carouselImage 轮播图
     * @return 结果
     */
    @Override
    public int updateCarouselImage(CarouselImage carouselImage)
    {
        carouselImage.setUpdateTime(DateUtils.getNowDate());
        return carouselImageMapper.updateCarouselImage(carouselImage);
    }

    /**
     * 批量删除轮播图
     * 
     * @param ids 需要删除的轮播图主键
     * @return 结果
     */
    @Override
    public int deleteCarouselImageByIds(Long[] ids)
    {
        return carouselImageMapper.deleteCarouselImageByIds(ids);
    }

    /**
     * 删除轮播图信息
     * 
     * @param id 轮播图主键
     * @return 结果
     */
    @Override
    public int deleteCarouselImageById(Long id)
    {
        return carouselImageMapper.deleteCarouselImageById(id);
    }

    /**
     * 处理轮播图查询结果
     */
    @Override
    public void handlerCarouselImageList(List<CarouselImage> carouselImageList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(carouselImageList)) {
            return;
        }

        Map<Long, Science> scienceMap = new HashMap<>();
        Map<Long, DynamicsPost> dynamicsPostMap = new HashMap<>();

        if (handlerOptions.contains("selectObject")) {
            List<Long> scienceIdList = carouselImageList.stream().filter(x -> x.getType() == 2).map(CarouselImage::getObjectId).toList();
            if (CollectionUtil.isNotEmpty(scienceIdList)) {
                scienceMap = scienceService.selectMapByIdList(scienceIdList);
            }
            List<Long> dynamicsPostIdList = carouselImageList.stream().filter(x -> x.getType() == 3).map(CarouselImage::getObjectId).toList();
            if (CollectionUtil.isNotEmpty(dynamicsPostIdList)) {
                dynamicsPostMap = dynamicsPostService.selectMapByIdList(dynamicsPostIdList);
            }
        }

        for (CarouselImage carouselImage : carouselImageList) {
            // 语言切换
            if (handlerOptions.contains("lang")) {
                carouselImage.setContent(
                    LanguageUtil.getResponseByLanguage(
                        new HashMap<>() {{
                            put(LanguageConstant.ZH, carouselImage.getContentZh());
                            put(LanguageConstant.EN, carouselImage.getContentEn());
                        }}
                    )
                );
            }

            if (handlerOptions.contains("selectObject")) {
                Long objectId = carouselImage.getObjectId();
                int type = Math.toIntExact(carouselImage.getType());
                switch(type) {
                    case 2:
                        carouselImage.setScience(scienceMap.get(objectId));
                        break;
                    case 3:
                        carouselImage.setDynamicsPost(dynamicsPostMap.get(objectId));
                        break;
                }
            }
        }
    }
}
