package com.ruoyi.mgkf.service;

import java.util.List;
import java.util.Map;

import com.ruoyi.mgkf.controller.vo.NumberStatisticsVo;
import com.ruoyi.mgkf.domain.Favorite;

/**
 * 收藏Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IFavoriteService 
{
    /**
     * 查询收藏
     * 
     * @param id 收藏主键
     * @return 收藏
     */
    public Favorite selectFavoriteById(Long id);

    /**
     * 查询收藏列表
     * 
     * @param favorite 收藏
     * @return 收藏集合
     */
    public List<Favorite> selectFavoriteList(Favorite favorite);

    /**
     * 新增收藏
     * 
     * @param favorite 收藏
     * @return 结果
     */
    public int insertFavorite(Favorite favorite);

    /**
     * 修改收藏
     * 
     * @param favorite 收藏
     * @return 结果
     */
    public int updateFavorite(Favorite favorite);

    /**
     * 批量删除收藏
     * 
     * @param ids 需要删除的收藏主键集合
     * @return 结果
     */
    public int deleteFavoriteByIds(Long[] ids);

    /**
     * 删除收藏信息
     * 
     * @param id 收藏主键
     * @return 结果
     */
    public int deleteFavoriteById(Long id);

    Map<Long, Favorite> selectMapByObjectIdAndTypeAndUserId(List<Long> objectIdList, Long objectType, Long userId);

    /**
     * 收藏/取消收藏
     */
    void addFavorite(Favorite.FavoriteBo bo);

    /**
     * 查询用户收藏数量
     */
    Long selectUserCollectionNum(Long userId);

    void deleteFavorite(Long objectId, Long objectType);

    void handlerFavoriteList(List<Favorite> favoriteList, List<String> selectOptions, Favorite favorite);

    NumberStatisticsVo numberStatistics();
}
