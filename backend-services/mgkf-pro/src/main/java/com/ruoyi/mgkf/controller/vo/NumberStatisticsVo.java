package com.ruoyi.mgkf.controller.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
public class NumberStatisticsVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    /**
     * 累计数量
     */
    private Long cumulativeNumber = 0L;

    /**
     * 今日数量
     */
    private Long todayNumber = 0L;

    /**
     * 昨日数量
     */
    private Long yesterdayNumber = 0L;

    /**
     * 环比
     */
    private Double annulus = 0.0;

    public void computeDayAnnulus() {
        if (this.yesterdayNumber == 0) {
            this.annulus = 0.0;
        } else {
            this.annulus = new BigDecimal(this.todayNumber).subtract(new BigDecimal(this.yesterdayNumber))
                .divide(new BigDecimal(this.yesterdayNumber), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100")).doubleValue();
        }
    }
}
