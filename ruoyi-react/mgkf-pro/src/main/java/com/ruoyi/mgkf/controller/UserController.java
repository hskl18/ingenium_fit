package com.ruoyi.mgkf.controller;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户
 */
@RestController
@RequestMapping("/mgkf/user")
public class UserController extends BaseController {

    @Autowired
    private IUserService userService;

    /**
     * 查询用户列表
     */
    @GetMapping("/list")
    public TableDataInfo<User> list(User user) {
        startPage();
        List<User> list = userService.selectUserList(user);
        return getDataTable(list);
    }

    /**
     * 获取用户详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        return success(userService.selectUserById(id));
    }

    /**
     * 新增用户
     */
    @Log(title = "用户", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody User user) {
        return toAjax(userService.insertUser(user));
    }

    /**
     * 修改用户
     */
    @Log(title = "用户", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody User user) {
        return toAjax(userService.updateUser(user));
    }

    /**
     * 删除用户
     */
    @Log(title = "用户", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(userService.deleteUserByIds(ids));
    }
}
