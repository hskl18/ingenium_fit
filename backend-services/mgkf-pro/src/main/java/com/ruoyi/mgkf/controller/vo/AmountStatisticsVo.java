package com.ruoyi.mgkf.controller.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
public class AmountStatisticsVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    /**
     * 累计金额
     */
    private BigDecimal cumulativeAmount = BigDecimal.ZERO;

    /**
     * 今日金额
     */
    private BigDecimal todayAmount = BigDecimal.ZERO;

    /**
     * 昨日金额
     */
    private BigDecimal yesterdayAmount = BigDecimal.ZERO;

    /**
     * 环比
     */
    private Double annulus;

    public void computeDayAnnulus() {
        if (this.yesterdayAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.annulus = 0.0;
        } else {
            this.annulus = this.todayAmount.subtract(this.yesterdayAmount)
                .divide(this.yesterdayAmount, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100")).doubleValue();
        }
    }
}
