package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.Favorite;

/**
 * 收藏Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface FavoriteMapper 
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
     * 删除收藏
     * 
     * @param id 收藏主键
     * @return 结果
     */
    public int deleteFavoriteById(Long id);

    /**
     * 批量删除收藏
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteFavoriteByIds(Long[] ids);

    /**
     * 收藏/取消收藏
     */
    void addFavorite(Favorite favorite);

    /**
     * 查询用户收藏数量
     */
    Long selectUserCollectionNum(Long userId);

    Long selectCount();
}
