package com.ruoyi.mgkf.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.service.IUserCommentService;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.Favorite;
import com.ruoyi.mgkf.domain.ScienceCategory;
import com.ruoyi.mgkf.service.IFavoriteService;
import com.ruoyi.mgkf.service.IScienceCategoryService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.system.util.LanguageUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.ScienceMapper;
import com.ruoyi.mgkf.domain.Science;
import com.ruoyi.mgkf.service.IScienceService;

/**
 * 科普Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class ScienceServiceImpl implements IScienceService 
{
    @Autowired
    private ScienceMapper scienceMapper;

    @Resource
    private IFavoriteService favoriteService;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IScienceCategoryService scienceCategoryService;

    /**
     * 查询科普
     * 
     * @param id 科普主键
     * @return 科普
     */
    @Override
    public Science selectScienceById(Long id)
    {
        return scienceMapper.selectScienceById(id);
    }

    /**
     * 查询科普列表
     * 
     * @param science 科普
     * @return 科普
     */
    @Override
    public List<Science> selectScienceList(Science science)
    {
        return scienceMapper.selectScienceList(science);
    }

    /**
     * 新增科普
     * 
     * @param science 科普
     * @return 结果
     */
    @Override
    public int insertScience(Science science)
    {
        science.setCreateTime(DateUtils.getNowDate());
        return scienceMapper.insertScience(science);
    }

    /**
     * 修改科普
     * 
     * @param science 科普
     * @return 结果
     */
    @Override
    public int updateScience(Science science)
    {
        science.setUpdateTime(DateUtils.getNowDate());
        return scienceMapper.updateScience(science);
    }

    /**
     * 批量删除科普
     * 
     * @param ids 需要删除的科普主键
     * @return 结果
     */
    @Override
    public int deleteScienceByIds(Long[] ids)
    {
        return scienceMapper.deleteScienceByIds(ids);
    }

    /**
     * 删除科普信息
     * 
     * @param id 科普主键
     * @return 结果
     */
    @Override
    public int deleteScienceById(Long id)
    {
        return scienceMapper.deleteScienceById(id);
    }

    /**
     * 处理科普查询结果
     */
    @Override
    public void handlerScienceList(List<Science> scienceList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(scienceList)) {
            return;
        }

        List<Long> scienceIdList = scienceList.stream().map(Science::getId).toList();
        List<Long> scienceCategoryIdList = scienceList.stream().map(Science::getScienceCategoryId).toList();

        Map<Long, Favorite> favoriteMap = new HashMap<>();
        Map<Long, ScienceCategory> scienceCategoryMap = new HashMap<>();

        if (handlerOptions.contains("whetherFavorite")) {
            favoriteMap = favoriteService.selectMapByObjectIdAndTypeAndUserId(scienceIdList, 2L, businessUtil.getLoginUser().getId());
        }

        if (handlerOptions.contains("selectScienceCategoryInfo")) {
            scienceCategoryMap = scienceCategoryService.selectMapByIds(scienceCategoryIdList);
            scienceCategoryService.handlerScienceCategoryList(new ArrayList<>(scienceCategoryMap.values()), List.of("lang"));
        }

        for (Science science : scienceList) {
            if (handlerOptions.contains("whetherFavorite")) {
                science.setWhetherFavoriteByLoginUser(favoriteMap.containsKey(science.getId()));
            }
            if (handlerOptions.contains("selectScienceCategoryInfo")) {
                science.setScienceCategory(scienceCategoryMap.get(science.getScienceCategoryId()));
            }
            if (handlerOptions.contains("lang")) {
                // 语言切换
                science.setContent(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, science.getContentZh(),
                            LanguageConstant.EN, science.getContentEn()
                        )
                    )
                );
                science.setTitle(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, science.getTitleZh(),
                            LanguageConstant.EN, science.getTitleEn()
                        )
                    )
                );
            }
        }
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        Science science = new Science();
        science.setCreateStartTime(yesterdayRange[0]);
        science.setCreateEndTime(todayRange[1]);
        List<Science> scienceList = scienceMapper.selectScienceList(science);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(scienceMapper.selectCount());
        if (CollUtil.isNotEmpty(scienceList)) {
            vo.setTodayNumber(
                scienceList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                scienceList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }

    @Override
    public Map<Long, Science> selectMapByIdList(List<Long> scienceIdList) {
        Science science = new Science();
        science.setScienceIdList(scienceIdList);
        List<Science> scienceList = scienceMapper.selectScienceList(science);
        handlerScienceList(scienceList, List.of("lang"));
        if (CollectionUtil.isEmpty(scienceList)) {
            return new HashMap<>();
        }
        return scienceList.stream().collect(Collectors.toMap(Science::getId, s -> s));
    }

    /**
     * 修改科普评论数量
     */
    @Override
    public void updateCommentNum(Long scienceId, Integer commentNum) {
        scienceMapper.updateCommentNum(scienceId, commentNum);
    }
}
