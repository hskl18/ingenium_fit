package com.ruoyi.mgkf.utils;

import cn.hutool.core.util.StrUtil;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TimeUtil {

    /**
     * 获取当前时间戳
     */
    public static Long timestampNow() {
        return System.currentTimeMillis();
    }

    /**
     * 在指定时间戳基础上偏移指定天数
     */
    private static Long timestampOffsetDays(Long timestamp, Integer dayNum, String timeZone) {
        // 将毫秒时间戳转换为 Instant
        Instant instant = Instant.ofEpochMilli(timestamp);

        // 转换为指定时区的 LocalDateTime
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of(timeZone));

        // 增加或减少指定天数
        LocalDateTime adjustedDateTime = localDateTime.plusDays(dayNum);

        // 转回 Instant 并获取调整后的毫秒时间戳
        return adjustedDateTime.atZone(ZoneId.of(timeZone)).toInstant().toEpochMilli();
    }

    /**
     * 在指定时间戳基础上添加指定天数
     */
    public static Long timestampAddDays(Long timestamp, Integer dayNum, String timeZone) {
        return timestampOffsetDays(timestamp, dayNum, timeZone);
    }

    /**
     * 在指定时间戳基础上减少指定天数
     */
    public static Long timestampSubtractDays(Long timestamp, Integer dayNum, String timeZone) {
        return timestampOffsetDays(timestamp, -dayNum, timeZone);
    }

    /**
     * 检查两个时间段是否有时间重叠
     *
     * @param realStartTime 第一个时间段的开始时间
     * @param realEndTime   第一个时间段的结束时间
     * @param startTime     第二个时间段的开始时间
     * @param endTime       第二个时间段的结束时间
     * @return true 表示时间有重叠
     */
    public static boolean isOverlap(Long realStartTime, Long realEndTime,
                                    Long startTime, Long endTime) {
        return realStartTime < endTime && startTime < realEndTime;
    }

    /**
     * 时间戳和时间字符串比较大小, 不考虑跨天的情况
     *
     * @param timeString   时间字符串, 格式: HH:mm
     * @param timestamp 时间戳
     * @param timeZone  时区
     * @return 时间戳对应时间小于字符串时间返回-1，等于返回0，大于返回1
     */
    public static int compareTimeStringAndTimestamp(String timeString, Long timestamp, String timeZone) {
        // 解析时间字符串为 LocalTime
        LocalTime targetTime = LocalTime.parse(timeString, DateTimeFormatter.ofPattern("HH:mm"));

        // 将毫秒时间戳转换为指定时区的 LocalTime
        Instant instant = Instant.ofEpochMilli(timestamp);
        LocalTime timestampTime = instant.atZone(ZoneId.of(timeZone)).toLocalTime();
        // 比较两个时间
        return timestampTime.compareTo(targetTime);
    }

    /**
     * 判断父区间是否完全包含子区间
     *
     * @param parentInterval 父区间字符串（如 "9-12,14-18"）
     * @param childInterval  子区间字符串（如 "9-12,12-18"）
     * @return true 父区间完全包含子区间
     */
    public static boolean judgeIntervalContain(String parentInterval, String childInterval) {
        try {
            // 解析并校验父区间和子区间
            List<TimeInterval> parentTimeIntervalList = parseInterval(parentInterval);
            List<TimeInterval> childTimeIntervalList = parseInterval(childInterval);

            // 合并区间
            List<TimeInterval> parentMergeTimeIntervalList = mergeInterval(parentTimeIntervalList);
            List<TimeInterval> childMergeTimeIntervalList = mergeInterval(childTimeIntervalList);

            // 检查每个子区间是否完全包含在某个父区间内
            for (TimeInterval childTimeInterval : childMergeTimeIntervalList) {
                boolean isContain = false;
                for (TimeInterval parentTimeInterval : parentMergeTimeIntervalList) {
                    if (childTimeInterval.start >= parentTimeInterval.start && childTimeInterval.end <= parentTimeInterval.end) {
                        isContain = true;
                        break;
                    }
                }
                if (!isContain) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 解析时间区间字符串为整数区间列表，并校验格式
     */
    private static List<TimeInterval> parseInterval(String intervalStr) {
        return Arrays.stream(intervalStr.split(",")).map(x -> {
            String[] parts = x.split("-");
            return new TimeInterval(Integer.parseInt(parts[0].trim()), Integer.parseInt(parts[1].trim()));
        }).toList();
    }

    /**
     * 合并重叠或相邻的区间
     */
    private static List<TimeInterval> mergeInterval(List<TimeInterval> timeIntervalList) {
        // 按起始时间排序
        List<TimeInterval> sorted = timeIntervalList.stream()
            .sorted(Comparator.comparingInt(o -> o.start))
            .toList();
        // 合并区间
        List<TimeInterval> mergeTimeIntervalList = new ArrayList<>();
        TimeInterval currentTimeInterval = sorted.get(0);

        for (int i = 1; i < sorted.size(); i++) {
            TimeInterval nextTimeInterval = sorted.get(i);
            if (nextTimeInterval.start <= currentTimeInterval.end + 1) {
                currentTimeInterval = new TimeInterval(
                    currentTimeInterval.start,
                    Math.max(currentTimeInterval.end, nextTimeInterval.end));
            } else {
                mergeTimeIntervalList.add(currentTimeInterval);
                currentTimeInterval = nextTimeInterval;
            }
        }

        mergeTimeIntervalList.add(currentTimeInterval);
        return mergeTimeIntervalList;
    }

    /**
     * 时间区间类
     */
    @Data
    private static class TimeInterval {
        private int start;
        private int end;

        public TimeInterval(int start, int end) {
            this.start = start;
            this.end = end;
        }
    }

    /**
     * 获取时间区间
     *
     * @param timeStr 时间字符串  "9-12,14-18,19-21" => [09:00, 21:00]
     * @return 时间区间数组
     */
    public static String[] getTimeRange(String timeStr) {
        List<LocalTime> allTimeList = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        String[] rangeArr = timeStr.split(",");
        for (String range : rangeArr) {
            String[] partArr = range.split("-");
            for (String part : partArr) {
                part = parseTime(part);
                if (StrUtil.isNotEmpty(part)) {
                    allTimeList.add(LocalTime.parse(part, formatter));
                }
            }
        }
        if (allTimeList.isEmpty()) {
            return new String[]{"", ""};
        }
        Collections.sort(allTimeList);
        return new String[]{
            allTimeList.get(0).format(formatter),
            allTimeList.get(allTimeList.size() - 1).format(formatter)
        };
    }

    /**
     * 在时间戳基础上添加指定时间字符串
     *
     * @param timestamp 时间戳
     * @param timeStr   时间字符串
     * @return 添加结果
     */
    public static Long timestampAddTimeStr(Long timestamp, String timeStr) {
        LocalTime addLocalTime = LocalTime.parse(timeStr, DateTimeFormatter.ofPattern("HH:mm"));
        return Instant.ofEpochMilli(timestamp)
            .plus(addLocalTime.getHour(), ChronoUnit.HOURS)
            .plus(addLocalTime.getMinute(), ChronoUnit.MINUTES).toEpochMilli();
    }

    /**
     * 将指定时间字符串转换为 HH:mm 格式
     *
     * @param timeStr 时间字符串
     * @return 转换结果
     */
    public static String parseTime(String timeStr) {
        if (StrUtil.isEmpty(timeStr)) {
            return null;
        }

        // 处理前后空格
        timeStr = timeStr.trim();

        // 9 => 09:00
        // 12 => 12:00
        if (timeStr.matches("\\d{1,2}")) {
            int hour = Integer.parseInt(timeStr);
            return String.format("%02d:00", hour);
        }

        // 9:30 => 09:30
        if (timeStr.matches("\\d:\\d+")) {
            String[] partArr = timeStr.split(":");
            int hourNum = Integer.parseInt(partArr[0]);
            int minuteNum = Integer.parseInt(partArr[1]);
            return String.format("%02d:%02d", hourNum, minuteNum);
        }

        try {
            // 按照 HH:mm 解析
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            return LocalTime.parse(timeStr, formatter).format(formatter);
        } catch (Exception e) {
            // 尝试解析 930 => 09:30
            if (timeStr.matches("\\d{3,4}")) {
                int hour = Integer.parseInt(timeStr.substring(0, timeStr.length() - 2));
                int minute = Integer.parseInt(timeStr.substring(timeStr.length() - 2));
                return String.format("%02d:%02d", hour, minute);
            }
        }

        return timeStr;
    }

    /**
     * 以当前时间为基准, 增加或减少指定月数后, 求当前时间和变化后时间每月的开始和结束时间戳
     *
     * @param timeZone 时区
     * @param step     步长
     * @return 结果
     */
    public static Map<Long, Long[]> getMonthRangeMap(String timeZone, Integer step) {
        Map<Long, Long[]> result = new LinkedHashMap<>();
        ZoneId zoneId = ZoneId.of(timeZone);
        LocalDateTime now = LocalDateTime.now(zoneId);

        if (step >= 0) {
            for (int i = 0; i <= step; i++) {
                long startMillis = now.plusMonths(i).with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN)
                    .atZone(zoneId).toInstant().toEpochMilli();
                result.put(startMillis, new Long[]{
                    startMillis,
                    now.plusMonths(i).with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX)
                        .atZone(zoneId).toInstant().toEpochMilli()
                });
            }
        } else {
            for (int i = Math.abs(step); i >= 0; i--) {
                long startMillis = now.minusMonths(i).with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN)
                    .atZone(zoneId).toInstant().toEpochMilli();
                result.put(startMillis, new Long[]{
                    startMillis,
                    now.minusMonths(i).with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX)
                        .atZone(zoneId).toInstant().toEpochMilli()
                });
            }
        }
        return result;
    }

    /**
     * 以当前时间为基准, 增加或减少指定天数后, 求当前时间和变化后时间每天的开始和结束时间戳
     *
     * @param timeZone 时区
     * @param step     步长
     * @return 结果
     */
    public static Map<Long, Long[]> getDayRangeMap(String timeZone, Integer step) {
        Long[] dayFromRange = getDayFromRange(timeZone, step);
        return getCustomRangeMap(dayFromRange[0], dayFromRange[1], timeZone);
    }

    /**
     * 获取自定义时间范围内每天的开始和结束时间戳
     *
     * @param startTime 开始时间戳
     * @param endTime   结束时间戳
     * @param timeZone  时区
     * @return 结果
     */
    public static Map<Long, Long[]> getCustomRangeMap(Long startTime, Long endTime, String timeZone) {
        Map<Long, Long[]> result = new LinkedHashMap<>();
        ZoneId zoneId = ZoneId.of(timeZone);

        LocalDate startDate = Instant.ofEpochMilli(startTime).atZone(zoneId).toLocalDate();
        LocalDate endDate = Instant.ofEpochMilli(endTime).atZone(zoneId).toLocalDate();

        // 计算日期差
        long dayDiff = ChronoUnit.DAYS.between(startDate, endDate);

        for (int i = 0; i <= dayDiff; i++) {
            LocalDate plusDay = startDate.plusDays(i);
            long startMillis = plusDay.atStartOfDay().atZone(zoneId).toInstant().toEpochMilli();
            result.put(startMillis, new Long[]{
                startMillis,
                plusDay.atTime(LocalTime.MAX).atZone(zoneId).toInstant().toEpochMilli()
            });
        }

        return result;
    }

    /**
     * 以当前时间为基准, 增加或减少指定月数, 获取当前时间和偏移后时间的开始和结束时间戳
     *
     * @param timeZone 时区
     * @param step     步长
     * @return 开始和结束时间戳
     */
    public static Long[] getMonthFromRange(String timeZone, Integer step) {
        ZoneId zoneId = ZoneId.of(timeZone);
        LocalDateTime now = LocalDateTime.now(zoneId);
        if (step >= 0) {
            return new Long[]{
                now.with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN).atZone(zoneId).toInstant().toEpochMilli(),
                now.plusMonths(step).with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX).atZone(zoneId).toInstant().toEpochMilli()
            };
        } else {
            return new Long[]{
                now.plusMonths(step).with(TemporalAdjusters.firstDayOfMonth()).with(LocalTime.MIN).atZone(zoneId).toInstant().toEpochMilli(),
                now.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX).atZone(zoneId).toInstant().toEpochMilli()
            };
        }
    }


    /**
     * 以当前时间为基准, 增加或减少指定天数, 获取当前时间和偏移后时间的开始和结束时间戳
     *
     * @param timeZone 时区
     * @param step     步长
     * @return 开始和结束时间戳
     */
    public static Long[] getDayFromRange(String timeZone, Integer step) {
        ZoneId zoneId = ZoneId.of(timeZone);
        LocalDateTime now = LocalDateTime.now(zoneId);
        if (step >= 0) {
            return new Long[]{
                now.with(LocalTime.MIN).atZone(zoneId).toInstant().toEpochMilli(),
                now.plusDays(step).with(LocalTime.MAX).atZone(zoneId).toInstant().toEpochMilli()
            };
        } else {
            return new Long[]{
                now.plusDays(step).with(LocalTime.MIN).atZone(zoneId).toInstant().toEpochMilli(),
                now.with(LocalTime.MAX).atZone(zoneId).toInstant().toEpochMilli()
            };
        }
    }

    /**
     * 获取明日的开始和结束时间戳
     *
     * @param timeZone 时区
     * @return 开始和结束时间戳
     */
    public static Long[] getTomorrowRange(String timeZone) {
        return getDayRange(timeZone, 1);
    }

    /**
     * 获取昨日的开始和结束时间戳
     *
     * @param timeZone 时区
     * @return 开始和结束时间戳
     */
    public static Long[] getYesterdayRange(String timeZone) {
        return getDayRange(timeZone, -1);
    }

    /**
     * 获取今日开始时间戳和结束时间戳
     *
     * @param timeZone 时区
     * @return 开始时间戳和结束时间戳
     */
    public static Long[] getTodayRange(String timeZone) {
        return getDayRange(timeZone, 0);
    }


    /**
     * 以当前日为基础, 增加或减少指定天数, 获取开始和结束时间戳
     *
     * @param timeZone 时区
     * @param step     步长
     * @return 开始和结束时间戳
     */
    public static Long[] getDayRange(String timeZone, Integer step) {
        ZoneId zoneId = ZoneId.of(timeZone);
        LocalDate date = LocalDate.now(zoneId);
        if (step >= 0) {
            return new Long[]{
                date.atStartOfDay(zoneId).toInstant().toEpochMilli(),
                date.plusDays(step).atTime(23, 59, 59, 999_000_000).atZone(zoneId).toInstant().toEpochMilli()
            };
        } else {
            return new Long[]{
                date.plusDays(step).atStartOfDay(zoneId).toInstant().toEpochMilli(),
                date.plusDays(step).atTime(23, 59, 59, 999_000_000).atZone(zoneId).toInstant().toEpochMilli()
            };
        }
    }

    /**
     * 获取下月的开始和结束时间戳
     *
     * @param timeZone 时区
     * @return 开始和结束时间戳
     */
    public static Long[] getNextMonthRange(String timeZone) {
        return getMonthRange(timeZone, 1);
    }

    /**
     * 获取上月的开始和结束时间戳
     *
     * @param timeZone 时区
     * @return 开始和结束时间戳
     */
    public static Long[] getLastMonthRange(String timeZone) {
        return getMonthRange(timeZone, -1);
    }

    /**
     * 获取本月的开始和结束时间戳
     *
     * @param timeZone 时区
     * @return 开始和结束时间戳
     */
    public static Long[] getCurrentMonthRange(String timeZone) {
        return getMonthRange(timeZone, 0);
    }


    /**
     * 以当前月为基础, 增加或减少指定月数, 获取开始和结束时间戳
     *
     * @param timeZone 时区
     * @param step     步长
     * @return 开始和结束时间戳
     */
    public static Long[] getMonthRange(String timeZone, Integer step) {
        ZoneId zoneId = ZoneId.of(timeZone);
        LocalDate today = LocalDate.now(zoneId);
        if (step >= 0) {
            return new Long[]{
                today.with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay(zoneId).toInstant().toEpochMilli(),
                today.plusMonths(step).with(TemporalAdjusters.lastDayOfMonth())
                    .atTime(23, 59, 59, 999_000_000).atZone(zoneId).toInstant().toEpochMilli()
            };
        } else {
            return new Long[]{
                today.plusMonths(step).with(TemporalAdjusters.firstDayOfMonth())
                    .atTime(23, 59, 59, 999_000_000).atZone(zoneId).toInstant().toEpochMilli(),
                today.with(TemporalAdjusters.lastDayOfMonth()).atStartOfDay(zoneId).toInstant().toEpochMilli()
            };
        }
    }


    /**
     * 获取指定时间戳在指定时区的开始和结束时间戳
     *
     * @param timestamp 时间戳
     * @param timeZone  时区
     * @return 开始和结束时间戳
     */
    public static Long[] getDayRange(Long timestamp, String timeZone) {
        ZonedDateTime zonedDateTime = getZonedDateTime(timestamp, timeZone);
        return new Long[]{
            zonedDateTime.with(LocalTime.MIN).toInstant().toEpochMilli(),
            zonedDateTime.with(LocalTime.MAX).toInstant().toEpochMilli()
        };
    }

    /**
     * 判断指定时间戳是不是在指定星期范围内
     *
     * @param timestamp 时间戳
     * @param timeZone  时区
     * @param beginWeek 开始星期 1-7 星期一至星期天
     * @param endWeek   结束星期 1-7 星期一至星期天
     * @return 判断结果
     */
    public static boolean betweenWeek(Long timestamp, String timeZone, Integer beginWeek, Integer endWeek) {
        int week = getWeek(timestamp, timeZone);
        // 如：周一 至 周五
        if (beginWeek <= endWeek) {
            return week >= beginWeek && week <= endWeek;
        } else {
            // 如：周五 至 下周三
            return week >= beginWeek || week <= endWeek;
        }
    }

    /**
     * 获取指定时间戳的星期数
     *
     * @param timestamp 时间戳
     * @param timeZone  时区
     * @return 星期数 1-7 星期一至星期天
     */
    public static int getWeek(Long timestamp, String timeZone) {
        return getZonedDateTime(timestamp, timeZone).getDayOfWeek().getValue();
    }

    private static ZonedDateTime getZonedDateTime(Long timestamp, String timeZone) {
        return Instant.ofEpochMilli(timestamp).atZone(ZoneId.of(timeZone));
    }

    /**
     * 计算指定日期与当前日期的天数差
     *
     * @param year     年份（如：2025）
     * @param month    月份（1-12）
     * @param day      日期（1-31）
     * @param timeZone 时区ID（如："Asia/Shanghai"）
     * @return 天数差（正数表示未来，负数表示过去，0表示当天）
     */
    public static int calculateDaysDifference(String year, String month, String day, String timeZone) {
        // 获取指定时区的当前日期
        LocalDate currentDate = LocalDate.now(ZoneId.of(timeZone));

        // 创建指定日期
        LocalDate targetDate = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), Integer.parseInt(day));

        // 计算天数差
        return (int) ChronoUnit.DAYS.between(currentDate, targetDate);
    }

    /**
     * 判断时间戳是否在指定时间戳区间内
     *
     * @param timestamp      时间戳
     * @param beginTimestamp 开始时间戳
     * @param endTimestamp   结束时间戳
     * @return true 时间戳在指定时间戳区间内 反之 false
     */
    public static boolean between(Long timestamp, Long beginTimestamp, Long endTimestamp) {
        return timestamp >= beginTimestamp && timestamp <= endTimestamp;
    }

    /**
     * 将毫秒时间戳按照指定时区和格式进行格式化
     *
     * @param timestamp 毫秒时间戳
     * @param zoneId    时区ID
     * @param pattern   格式化模式
     */
    public static String formatTimestamp(long timestamp, String zoneId, String pattern) {
        // 将毫秒时间戳转换为Instant
        Instant instant = Instant.ofEpochMilli(timestamp);

        // 指定时区
        ZoneId zone = ZoneId.of(zoneId);

        // 创建格式化器
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern)
            .withZone(zone);

        // 格式化并返回结果
        return formatter.format(instant);
    }

    /**
     * 计算两个时间戳在指定时区下的年份差, 保留一位小数
     *
     * @param startTimestamp 起始时间戳
     * @param endTimestamp   结束时间戳
     * @param zoneId         时区
     * @return 两个时间戳相差的年份, 保留一位小数
     */
    public static double calculateYearWithTimestamp(
        Long startTimestamp,
        Long endTimestamp,
        String zoneId) {

        // 验证时区有效性
        ZoneId zone = ZoneId.of(zoneId);

        // 将时间戳转换为指定时区的LocalDate
        LocalDate date1 = Instant.ofEpochMilli(startTimestamp)
            .atZone(zone)
            .toLocalDate();
        LocalDate date2 = Instant.ofEpochMilli(endTimestamp)
            .atZone(zone)
            .toLocalDate();

        // 计算相差的总天数
        long daysDiff = Math.abs(ChronoUnit.DAYS.between(date1, date2));

        // 转换为年（除以平均年天数365.25，考虑闰年）
        double years = daysDiff / 365.25;

        // 保留一位小数（四舍五入）
        BigDecimal bd = new BigDecimal(years).setScale(1, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
