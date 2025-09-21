package com.ruoyi.mgkf.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.system.util.LanguageConstant;
import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.Favorite;
import com.ruoyi.mgkf.service.IFavoriteService;
import com.ruoyi.mgkf.service.IUserCommentService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.system.util.LanguageUtil;
import com.ruoyi.mgkf.utils.TimeUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.RehabilitationCenterMapper;
import com.ruoyi.mgkf.domain.RehabilitationCenter;
import com.ruoyi.mgkf.service.IRehabilitationCenterService;

/**
 * 康复中心Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class RehabilitationCenterServiceImpl implements IRehabilitationCenterService 
{
    @Autowired
    private RehabilitationCenterMapper rehabilitationCenterMapper;

    @Resource
    private IFavoriteService favoriteService;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IUserCommentService userCommentService;

    /**
     * 查询康复中心
     * 
     * @param id 康复中心主键
     * @return 康复中心
     */
    @Override
    public RehabilitationCenter selectRehabilitationCenterById(Long id)
    {
        return rehabilitationCenterMapper.selectRehabilitationCenterById(id);
    }

    /**
     * 查询康复中心列表
     * 
     * @param rehabilitationCenter 康复中心
     * @return 康复中心
     */
    @Override
    public List<RehabilitationCenter> selectRehabilitationCenterList(RehabilitationCenter rehabilitationCenter)
    {
        return rehabilitationCenterMapper.selectRehabilitationCenterList(rehabilitationCenter);
    }

    /**
     * 新增康复中心
     * 
     * @param rehabilitationCenter 康复中心
     * @return 结果
     */
    @Override
    public int insertRehabilitationCenter(RehabilitationCenter rehabilitationCenter)
    {
        rehabilitationCenter.setCreateTime(DateUtils.getNowDate());
        return rehabilitationCenterMapper.insertRehabilitationCenter(rehabilitationCenter);
    }

    /**
     * 修改康复中心
     * 
     * @param rehabilitationCenter 康复中心
     * @return 结果
     */
    @Override
    public int updateRehabilitationCenter(RehabilitationCenter rehabilitationCenter)
    {
        rehabilitationCenter.setUpdateTime(DateUtils.getNowDate());
        return rehabilitationCenterMapper.updateRehabilitationCenter(rehabilitationCenter);
    }

    /**
     * 批量删除康复中心
     * 
     * @param ids 需要删除的康复中心主键
     * @return 结果
     */
    @Override
    public int deleteRehabilitationCenterByIds(Long[] ids)
    {
        return rehabilitationCenterMapper.deleteRehabilitationCenterByIds(ids);
    }

    /**
     * 删除康复中心信息
     * 
     * @param id 康复中心主键
     * @return 结果
     */
    @Override
    public int deleteRehabilitationCenterById(Long id)
    {
        return rehabilitationCenterMapper.deleteRehabilitationCenterById(id);
    }

    /**
     * 处理康复中心查询结果
     */
    @Override
    public void handlerRehabilitationCenterList(List<RehabilitationCenter> rehabilitationCenterList, List<String> handlerOptions) {
        if (CollectionUtil.isEmpty(rehabilitationCenterList)) {
            return;
        }

        List<Long> rehabilitationCenterIdList = rehabilitationCenterList.stream().map(RehabilitationCenter::getId).toList();

        Map<Long, Favorite> favoriteMap = new HashMap<>();

        // 查询登录用户是否收藏康复中心
        if (handlerOptions.contains("whetherFavorite")) {
            favoriteMap = favoriteService.selectMapByObjectIdAndTypeAndUserId(rehabilitationCenterIdList, 1L, businessUtil.getLoginUser().getId());
        }

        for (RehabilitationCenter rehabilitationCenter : rehabilitationCenterList) {

            // 设置用户是否收藏康复中心
            if (handlerOptions.contains("whetherFavorite")) {
                rehabilitationCenter.setWhetherFavoriteByLoginUser(favoriteMap.containsKey(rehabilitationCenter.getId()));
            }

            // 语言切换
            if (handlerOptions.contains("lang")) {
                rehabilitationCenter.setName(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, rehabilitationCenter.getNameZh(),
                            LanguageConstant.EN, rehabilitationCenter.getNameEn()
                        )
                    )
                );
                rehabilitationCenter.setDetail(
                    LanguageUtil.getResponseByLanguage(
                        Map.of(
                            LanguageConstant.ZH, rehabilitationCenter.getDetailZh(),
                            LanguageConstant.EN, rehabilitationCenter.getDetailEn()
                        )
                    )
                );
            }
        }
    }

    /**
     * 计算康复中心星级
     */
    @Override
    public void computeStar(Long rehabilitationCenterId) {
        Double computeStar = userCommentService.computeStar(rehabilitationCenterId, 3L);
        if (computeStar == null) {
            return;
        }
        RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
        rehabilitationCenter.setStar(computeStar);
        rehabilitationCenter.setId(rehabilitationCenterId);
        rehabilitationCenterMapper.updateRehabilitationCenter(rehabilitationCenter);
    }

    /**
     * 修改康复中心评论数
     */
    @Override
    public void updateCommentNum(Long rehabilitationCenterId, Integer commentNum) {
        rehabilitationCenterMapper.updateCommentNum(rehabilitationCenterId, commentNum);
    }

    @Override
    public Map<Long, RehabilitationCenter> selectMapByIds(List<Long> rehabilitationCenterIdList) {
        RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
        rehabilitationCenter.setRehabilitationCenterIdList(rehabilitationCenterIdList);
        List<RehabilitationCenter> rehabilitationCenterList = rehabilitationCenterMapper.selectRehabilitationCenterList(rehabilitationCenter);
        return CollectionUtil.isNotEmpty(rehabilitationCenterList) ?
            rehabilitationCenterList.stream().collect(Collectors.toMap(RehabilitationCenter::getId, s -> s)) : new HashMap<>();
    }

    @Override
    public NumberStatisticsVo numberStatistics() {
        Long[] todayRange = TimeUtil.getTodayRange(ZoneUtil.getZone());
        Long[] yesterdayRange = TimeUtil.getYesterdayRange(ZoneUtil.getZone());
        RehabilitationCenter rehabilitationCenter = new RehabilitationCenter();
        rehabilitationCenter.setCreateStartTime(yesterdayRange[0]);
        rehabilitationCenter.setCreateEndTime(todayRange[1]);
        List<RehabilitationCenter> rehabilitationCenterList = rehabilitationCenterMapper.selectRehabilitationCenterList(rehabilitationCenter);

        NumberStatisticsVo vo = new NumberStatisticsVo();
        vo.setCumulativeNumber(rehabilitationCenterMapper.selectCount());
        if (CollUtil.isNotEmpty(rehabilitationCenterList)) {
            vo.setTodayNumber(
                rehabilitationCenterList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), todayRange[0], todayRange[1])).count()
            );
            vo.setYesterdayNumber(
                rehabilitationCenterList.stream().filter(x -> TimeUtil.between(x.getCreateTime(), yesterdayRange[0],
                    yesterdayRange[1])).count()
            );
            vo.computeDayAnnulus();
        }
        return vo;
    }
}
