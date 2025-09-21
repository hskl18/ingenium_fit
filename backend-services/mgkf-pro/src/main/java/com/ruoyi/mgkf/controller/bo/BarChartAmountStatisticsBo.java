package com.ruoyi.mgkf.controller.bo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class BarChartAmountStatisticsBo implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    /**
     * 时间类型：1-近一年 2-近一月 3-时间自定义
     */
    private Integer timeType;

    /**
     * 开始时间戳
     */
    private Long startTimestamp;

    /**
     * 结束时间戳
     */
    private Long endTimestamp;
}
