package com.ruoyi.mgkf.controller.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
public class RankingListModelStatisticsVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    /**
     * 发布动态帖子排行
     */
    private List<RankingListStatisticsVo> dynamicsPostRankingList;

    /**
     * 用户点赞排行
     */
    private List<RankingListStatisticsVo> userGiveLikeRankingList;
}
