package com.ruoyi.mgkf.service;

import java.util.List;
import com.ruoyi.mgkf.domain.AppVersion;

/**
 * 版本Service接口
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
public interface IAppVersionService 
{
    /**
     * 查询版本
     * 
     * @param id 版本主键
     * @return 版本
     */
    public AppVersion selectAppVersionById(Long id);

    /**
     * 查询版本列表
     * 
     * @param appVersion 版本
     * @return 版本集合
     */
    public List<AppVersion> selectAppVersionList(AppVersion appVersion);

    /**
     * 新增版本
     * 
     * @param appVersion 版本
     * @return 结果
     */
    public int insertAppVersion(AppVersion appVersion);

    /**
     * 修改版本
     * 
     * @param appVersion 版本
     * @return 结果
     */
    public int updateAppVersion(AppVersion appVersion);

    /**
     * 批量删除版本
     * 
     * @param ids 需要删除的版本主键集合
     * @return 结果
     */
    public int deleteAppVersionByIds(Long[] ids);

    /**
     * 删除版本信息
     * 
     * @param id 版本主键
     * @return 结果
     */
    public int deleteAppVersionById(Long id);

    AppVersion selectLatestVersion();
}
