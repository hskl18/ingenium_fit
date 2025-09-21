package com.ruoyi.web;

import com.ruoyi.mgkf.domain.DoctorEducationalBackground;
import com.ruoyi.mgkf.domain.DynamicsPost;
import com.ruoyi.mgkf.mapper.DoctorEducationalBackgroundMapper;
import com.ruoyi.mgkf.mapper.DynamicsPostMapper;
import com.ruoyi.mgkf.service.IDoctorEducationalBackgroundService;
import com.ruoyi.mgkf.service.IDoctorWorkExperienceService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class RuoYiApplicationTest {

    @Autowired
    private DoctorEducationalBackgroundMapper doctorEducationalBackgroundMapper;

    @Resource
    private IDoctorEducationalBackgroundService doctorEducationalBackgroundService;

    @Resource
    private DynamicsPostMapper dynamicsPostMapper;

    @Test
    void test() {
        List<DynamicsPost> dynamicsPostList = dynamicsPostMapper.selectDynamicsPostByIds(List.of(1939608726551461890L));
        System.out.println();
    }
}
