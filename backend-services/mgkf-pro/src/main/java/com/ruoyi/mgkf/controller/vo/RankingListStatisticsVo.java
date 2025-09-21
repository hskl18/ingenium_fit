package com.ruoyi.mgkf.controller.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class RankingListStatisticsVo implements Serializable {

    @Serial
    private static final long serialVersionUID = 2L;

    /**
     * 排行对象
     */
    private String rankingObject;

    /**
     * 排行结果
     */
    private String rankingResult;
}
