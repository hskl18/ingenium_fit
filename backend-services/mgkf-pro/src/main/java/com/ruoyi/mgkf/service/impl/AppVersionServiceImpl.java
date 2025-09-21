package com.ruoyi.mgkf.service.impl;

import java.util.List;
import com.ruoyi.common.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.mgkf.mapper.AppVersionMapper;
import com.ruoyi.mgkf.domain.AppVersion;
import com.ruoyi.mgkf.service.IAppVersionService;

/**
 * 版本Service业务层处理
 * 
 * @author ruoyi
 * @date 2025-08-15
 */
@Service
public class AppVersionServiceImpl implements IAppVersionService 
{
    @Autowired
    private AppVersionMapper appVersionMapper;

    /**
     * 查询版本
     * 
     * @param id 版本主键
     * @return 版本
     */
    @Override
    public AppVersion selectAppVersionById(Long id)
    {
        return appVersionMapper.selectAppVersionById(id);
    }

    /**
     * 查询版本列表
     * 
     * @param appVersion 版本
     * @return 版本
     */
    @Override
    public List<AppVersion> selectAppVersionList(AppVersion appVersion)
    {
        return appVersionMapper.selectAppVersionList(appVersion);
    }

    /**
     * 新增版本
     * 
     * @param appVersion 版本
     * @return 结果
     */
    @Override
    public int insertAppVersion(AppVersion appVersion)
    {
        appVersion.setCreateTime(DateUtils.getNowDate());
        return appVersionMapper.insertAppVersion(appVersion);
    }

    /**
     * 修改版本
     * 
     * @param appVersion 版本
     * @return 结果
     */
    @Override
    public int updateAppVersion(AppVersion appVersion)
    {
        appVersion.setUpdateTime(DateUtils.getNowDate());
        return appVersionMapper.updateAppVersion(appVersion);
    }

    /**
     * 批量删除版本
     * 
     * @param ids 需要删除的版本主键
     * @return 结果
     */
    @Override
    public int deleteAppVersionByIds(Long[] ids)
    {
        return appVersionMapper.deleteAppVersionByIds(ids);
    }

    /**
     * 删除版本信息
     * 
     * @param id 版本主键
     * @return 结果
     */
    @Override
    public int deleteAppVersionById(Long id)
    {
        return appVersionMapper.deleteAppVersionById(id);
    }

    @Override
    public AppVersion selectLatestVersion() {
        return appVersionMapper.selectLatestVersion();
    }
}
