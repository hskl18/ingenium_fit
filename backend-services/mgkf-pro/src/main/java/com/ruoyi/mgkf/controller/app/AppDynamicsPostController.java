package com.ruoyi.mgkf.controller.app;

import cn.hutool.core.collection.CollectionUtil;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.IdBo;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.DynamicsPost;
import com.ruoyi.mgkf.domain.DynamicsPostBlock;
import com.ruoyi.mgkf.service.IDynamicsPostBlockService;
import com.ruoyi.mgkf.service.IDynamicsPostService;
import com.ruoyi.mgkf.service.IFollowService;
import com.ruoyi.mgkf.utils.BusinessUtil;
import com.ruoyi.mgkf.utils.ZoneUtil;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 动态帖子
 */
@RestController
@RequestMapping("/app/post")
public class AppDynamicsPostController extends BaseController {
    @Autowired
    private IDynamicsPostService dynamicsPostService;

    @Resource
    private IFollowService followService;

    @Resource
    private BusinessUtil businessUtil;

    @Resource
    private IDynamicsPostBlockService dynamicsPostBlockService;

    /**
     * 查询动态帖子列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<DynamicsPost> list(@RequestBody DynamicsPost.DynamicsPostListBo bo) {
        Long loginUserId = businessUtil.getLoginUser().getId();
        DynamicsPost dynamicsPost = new DynamicsPost();
        dynamicsPost.setWhetherRecommend(bo.getWhetherRecommend());
        dynamicsPost.setDelFlag(PublicCommon.ENABLE);
        // dynamicsPost.setWhetherPublic(1L);
        dynamicsPost.setDynamicsPostCategoryId(bo.getDynamicsPostCategoryId());
        dynamicsPost.setSearchKey(bo.getSearchKey());
        dynamicsPost.setSortBy(bo.getSortBy());
        dynamicsPost.setBlockDynamicsPostIdList(dynamicsPostBlockService.selectByUserId(loginUserId));
        // 查询可以看到帖子的用户, 自己的和关注我的人
        List<Long> notPublicUserIdList = CollectionUtil.newArrayList(loginUserId);
        List<Long> byFollowUserIdList = followService.selectByFollowUserIdList(loginUserId);
        if (CollectionUtil.isNotEmpty(byFollowUserIdList)) {
            notPublicUserIdList.addAll(byFollowUserIdList);
        }
        dynamicsPost.setNotPublicUserIdList(notPublicUserIdList);

        if (bo.getSelectType() != null && bo.getSelectType() == 1) { // 1-朋友动态
            List<Long> followUserIdList = followService.selectFollowUserIdList(loginUserId);
            dynamicsPost.setUserIdList(CollectionUtil.isNotEmpty(followUserIdList) ? followUserIdList : CollectionUtil.newArrayList(-1L));
        }
        if (bo.getSelectType() != null && bo.getSelectType() == 2) { // Recently最近的
            // 默认按照时间倒序排列,所以无需额外处理
        }
        startPage();
        List<DynamicsPost> list = dynamicsPostService.selectDynamicsPostList(dynamicsPost);
        dynamicsPostService.handlerDynamicsPostList(list, List.of("selectUserInfo", "whetherGiveLike", "whetherFavorite"));
        return getDataTable(list);
    }

    /**
     * 我的动态帖子列表
     */
    @PostMapping("/my/list")
    @UserLoginToken
    public TableDataInfo<DynamicsPost> list() {
        startPage();
        DynamicsPost dynamicsPost = new DynamicsPost();
        //dynamicsPost.setDelFlag(PublicCommon.ENABLE);
        dynamicsPost.setUserId(businessUtil.getLoginUser().getId());
        dynamicsPost.setTimeZone(ZoneUtil.getZone());
        List<DynamicsPost> list = dynamicsPostService.selectDynamicsPostTimeGroupList(dynamicsPost);
        dynamicsPostService.handlerDynamicsPostList(list, List.of("handlerTimeGroup"));
        return getDataTable(list);
    }

    /**
     * 获取动态帖子详细信息
     */
    @PostMapping(value = "/detail")
    public R<DynamicsPost> getInfo(@RequestBody IdBo bo) {
        DynamicsPost dynamicsPost = dynamicsPostService.selectDynamicsPostById(bo.getId());
        if (dynamicsPost != null) {
            dynamicsPostService.handlerDynamicsPostList(List.of(dynamicsPost), List.of("selectUserInfo",
                "whetherGiveLike", "whetherBlock", "whetherFollow", "whetherFavorite"));
        }
        return R.ok(dynamicsPost);
    }

    /**
     * 转发帖子
     */
    @PostMapping(value = "/forward")
    @UserLoginToken
    public R<Void> forward(@RequestBody IdBo bo) {
        dynamicsPostService.updateForwardNum(bo.getId(), 1L);
        return R.ok();
    }

    /**
     * 发布动态帖子
     */
    @PostMapping("/publish")
    @UserLoginToken
    public R<Void> add(@RequestBody DynamicsPost.DynamicsPostBo bo) {
        DynamicsPost dynamicsPost = new DynamicsPost();
        dynamicsPost.setDynamicsPostCategoryId(bo.getDynamicsPostCategoryId());
        dynamicsPost.setContent(bo.getContent());
        dynamicsPost.setPictures(bo.getPictures());
        dynamicsPost.setVideos(bo.getVideos());
        dynamicsPost.setWhetherPublic(bo.getWhetherPublic());
        dynamicsPost.setUserId(businessUtil.getLoginUser().getId());
        dynamicsPost.setCreateTime(DateUtils.getNowDate());
        dynamicsPost.setUpdateTime(DateUtils.getNowDate());
        dynamicsPostService.insertDynamicsPost(dynamicsPost);
        return R.ok();
    }

    /**
     * 屏蔽动态帖子/取消屏蔽
     */
    @PostMapping("/block")
    @UserLoginToken
    public R<Void> add(@RequestBody IdBo bo) {
        DynamicsPostBlock dynamicsPostBlock = new DynamicsPostBlock();
        dynamicsPostBlock.setUserId(businessUtil.getLoginUser().getId());
        dynamicsPostBlock.setBlockDynamicsPostId(bo.getId());
        dynamicsPostBlock.setCreateTime(DateUtils.getNowDate());
        dynamicsPostBlock.setUpdateTime(DateUtils.getNowDate());
        dynamicsPostBlockService.addDynamicsPostBlock(dynamicsPostBlock);
        return R.ok();
    }

    /**
     * 删除动态帖子
     */
    @PostMapping("/delete")
    @UserLoginToken
    public R<Void> remove(@RequestBody IdBo bo) {
        dynamicsPostService.deleteDynamicsPostById(bo.getId());
        return R.ok();
    }
}
