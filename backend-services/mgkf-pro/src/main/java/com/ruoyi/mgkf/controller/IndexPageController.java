package com.ruoyi.mgkf.controller;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.mgkf.controller.bo.BarChartAmountStatisticsBo;
import com.ruoyi.mgkf.controller.vo.BarChartAmountStatisticsVo;
import com.ruoyi.mgkf.controller.vo.NumberModelStatisticsVo;
import com.ruoyi.mgkf.controller.vo.RankingListModelStatisticsVo;
import com.ruoyi.mgkf.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 首页控制器
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/mgkf/index")
public class IndexPageController extends BaseController {

    private final IUserService userService;
    private final IFollowService followService;
    private final IScienceService scienceService;
    private final IRehabilitationCenterService rehabilitationCenterService;
    private final IDynamicsPostService dynamicsPostService;
    private final ILeaveWordSubService leaveWordSubService;
    private final IGiveLikeService giveLikeService;
    private final IFavoriteService favoriteService;


    /**
     * 数量模块统计
     */
    @PostMapping("/numberModelStatistics")
    public R<NumberModelStatisticsVo> numberModelStatistics() {
        NumberModelStatisticsVo vo = new NumberModelStatisticsVo();
        vo.setUserStatistics(userService.numberStatistics());
        vo.setFollowStatistics(followService.numberStatistics());
        vo.setScienceStatistics(scienceService.numberStatistics());
        vo.setRehabilitationCenterStatistics(rehabilitationCenterService.numberStatistics());
        vo.setDynamicsPostStatistics(dynamicsPostService.numberStatistics());
        vo.setLeaveWordStatistics(leaveWordSubService.numberStatistics());
        vo.setGiveLikeStatistics(giveLikeService.numberStatistics());
        vo.setFavoriteStatistics(favoriteService.numberStatistics());
        return R.ok(vo);
    }

    /**
     * 柱状图模块统计
     */
    @PostMapping("/barChartModelStatistics")
    public R<List<BarChartAmountStatisticsVo>> barChartModelStatistics(@RequestBody BarChartAmountStatisticsBo bo) {
        return R.ok(userService.barChartModelStatistics(bo));
    }

    /**
     * 排行榜模块统计
     */
    @PostMapping("/rankingListModelStatistics")
    public R<RankingListModelStatisticsVo> rankingListModelStatistics() {
        RankingListModelStatisticsVo vo = new RankingListModelStatisticsVo();
        vo.setDynamicsPostRankingList(dynamicsPostService.rankingListModelStatistics());
        vo.setUserGiveLikeRankingList(giveLikeService.rankingListModelStatistics());
        return R.ok(vo);
    }
}
