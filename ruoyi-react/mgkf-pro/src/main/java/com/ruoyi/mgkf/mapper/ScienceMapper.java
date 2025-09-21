package com.ruoyi.mgkf.mapper;

import java.util.List;
import com.ruoyi.mgkf.domain.Science;
import org.apache.ibatis.annotations.Param;

/**
 * 科普Mapper接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface ScienceMapper 
{
    /**
     * 查询科普
     * 
     * @param id 科普主键
     * @return 科普
     */
    public Science selectScienceById(Long id);

    /**
     * 查询科普列表
     * 
     * @param science 科普
     * @return 科普集合
     */
    public List<Science> selectScienceList(Science science);

    /**
     * 新增科普
     * 
     * @param science 科普
     * @return 结果
     */
    public int insertScience(Science science);

    /**
     * 修改科普
     * 
     * @param science 科普
     * @return 结果
     */
    public int updateScience(Science science);

    /**
     * 删除科普
     * 
     * @param id 科普主键
     * @return 结果
     */
    public int deleteScienceById(Long id);

    /**
     * 批量删除科普
     * 
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteScienceByIds(Long[] ids);

    Long selectCount();

    /**
     * 修改科普评论数量
     */
    void updateCommentNum(@Param("scienceId") Long scienceId, @Param("commentNum") Integer commentNum);
}
