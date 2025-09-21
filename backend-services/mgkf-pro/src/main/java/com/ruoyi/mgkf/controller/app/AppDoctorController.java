package com.ruoyi.mgkf.controller.app;

import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.mgkf.constant.PublicCommon;
import com.ruoyi.mgkf.controller.app.bo.IdBo;
import com.ruoyi.mgkf.controller.app.login.annotation.UserLoginToken;
import com.ruoyi.mgkf.domain.Doctor;
import com.ruoyi.mgkf.service.IDoctorService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 医师
 */
@RestController
@RequestMapping("/app/doctor")
public class AppDoctorController extends BaseController {
    @Autowired
    private IDoctorService doctorService;

    /**
     * 查询医师列表
     */
    @PostMapping("/list")
    @UserLoginToken
    public TableDataInfo<Doctor> list(@RequestBody Doctor.DoctorListBo bo) {
        Doctor doctor = new Doctor();
        doctor.setRehabilitationCenterId(bo.getRehabilitationCenterId());
        doctor.setDelFlag(PublicCommon.ENABLE);
        startPage();
        List<Doctor> list = doctorService.selectDoctorList(doctor);
        doctorService.handlerDoctorList(list, List.of("lang"));
        return getDataTable(list);
    }

    /**
     * 获取医师详细信息
     */
    @UserLoginToken
    @PostMapping(value = "/detail")
    public R<Doctor> getInfo(@RequestBody IdBo bo) {
        Doctor doctor = doctorService.selectDoctorById(bo.getId());
        if (doctor != null) {
            doctorService.handlerDoctorList(List.of(doctor), List.of("lang", "selectEducationalBackground", "selectWorkExperience"));
        }
        return R.ok(doctor);
    }
}
