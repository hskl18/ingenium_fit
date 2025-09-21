package com.ruoyi.mgkf.controller.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 柱状图金额统计
 */
@Data
public class BarChartAmountStatisticsVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 3L;

    /**
     * 时间戳
     */
    private Long timestamp;

    /**
     * 人数
     */
    private Integer peopleCount = 0;
}
