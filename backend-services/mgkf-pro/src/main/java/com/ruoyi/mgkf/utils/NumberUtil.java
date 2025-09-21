package com.ruoyi.mgkf.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NumberUtil {

    /**
     * 对 Long 类型数字按照指定排序, 排序后以逗号间隔拼接成字符串
     */
    private static String sortAndJoinLong(boolean isAsc, Long... longs) {
        // 处理空输入
        if (longs == null || longs.length == 0) {
            return "";
        }

        // 排序
        if (isAsc) {
            // 正序排序（自然顺序）
            Arrays.sort(longs);
        } else {
            // 倒序排序
            Arrays.sort(longs, Comparator.reverseOrder());
        }

        // 转换为逗号分隔的字符串
        return Arrays.stream(longs)
            .map(String::valueOf)
            .collect(Collectors.joining(","));
    }

    /**
     * 对 Long 类型数字按照正序排序, 排序后以逗号间隔拼接成字符串
     */
    public static String sortAscAndJoinLong(Long... longs) {
        return sortAndJoinLong(true, longs);
    }

    /**
     * 对 Long 类型数字按照倒序排序, 排序后以逗号间隔拼接成字符串
     */
    public static String sortDescAndJoinLong(Long... longs) {
        return sortAndJoinLong(false, longs);
    }





    public static void main(String[] args) {
    }
}
