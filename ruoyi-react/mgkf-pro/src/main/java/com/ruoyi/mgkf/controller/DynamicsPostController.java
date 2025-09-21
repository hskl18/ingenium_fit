package com.ruoyi.mgkf.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.StrUtil;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.DynamicsPost;
import com.ruoyi.mgkf.domain.User;
import com.ruoyi.mgkf.service.IDynamicsPostService;
import com.ruoyi.mgkf.service.IUserService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 动态帖子
 */
@RestController
@RequestMapping("/mgkf/post")
public class DynamicsPostController extends BaseController {

    @Autowired
    private IDynamicsPostService dynamicsPostService;

    @Resource
    private IUserService userService;

    /**
     * 查询动态帖子列表
     */
    @GetMapping("/list")
    public TableDataInfo<DynamicsPost> list(DynamicsPost dynamicsPost) {
        String author = dynamicsPost.getAuthor();
        if (StrUtil.isNotEmpty(author)) {
            User user = new User();
            user.setNickName(author);
            List<User> userList = userService.selectUserList(user);
            dynamicsPost.setUserIdList(
                CollectionUtil.isEmpty(userList) ? CollectionUtil.newArrayList(-1L) :
                    userList.stream().map(User::getId).toList()
            );
        }
        startPage();
        List<DynamicsPost> list = dynamicsPostService.selectDynamicsPostList(dynamicsPost);
        dynamicsPostService.handlerDynamicsPostList(list, List.of("selectDynamicsPostCategoryInfo", "selectUserInfo"));
        return getDataTable(list);
    }

    /**
     * 获取动态帖子详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        DynamicsPost dynamicsPost = dynamicsPostService.selectDynamicsPostById(id);
        if (dynamicsPost != null) {
            dynamicsPostService.handlerDynamicsPostList(List.of(dynamicsPost), List.of("selectDynamicsPostCategoryInfo", "selectUserInfo"));
        }
        return success(dynamicsPost);
    }

    /**
     * 新增动态帖子
     */
    @Log(title = "动态帖子", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody DynamicsPost dynamicsPost) {
        return toAjax(dynamicsPostService.insertDynamicsPost(dynamicsPost));
    }

    /**
     * 修改动态帖子
     */
    @Log(title = "动态帖子", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody DynamicsPost dynamicsPost) {
        return toAjax(dynamicsPostService.updateDynamicsPost(dynamicsPost));
    }

    /**
     * 删除动态帖子
     */
    @Log(title = "动态帖子", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        return toAjax(dynamicsPostService.deleteDynamicsPostByIds(ids));
    }
}
