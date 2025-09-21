package com.ruoyi.mgkf.controller.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class NumberModelStatisticsVo implements Serializable {

    @Serial
    private static final long serialVersionUID = -7461621276394987533L;

    /**
     * 用户数量统计
     */
    private NumberStatisticsVo userStatistics;

    /**
     * 关注数量统计
     */
    private NumberStatisticsVo followStatistics;

    /**
     * 科普数量统计
     */
    private NumberStatisticsVo scienceStatistics;

    /**
     * 康复中心数量统计
     */
    private NumberStatisticsVo rehabilitationCenterStatistics;

    /**
     * 动态帖子数量统计
     */
    private NumberStatisticsVo dynamicsPostStatistics;

    /**
     * 留言数量统计
     */
    private NumberStatisticsVo leaveWordStatistics;

    /**
     * 点赞数量统计
     */
    private NumberStatisticsVo giveLikeStatistics;

    /**
     * 收藏数量统计
     */
    private NumberStatisticsVo favoriteStatistics;
}
