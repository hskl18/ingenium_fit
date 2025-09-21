package com.ruoyi.mgkf.controller;

import java.util.List;

import com.ruoyi.mgkf.service.IDoctorEducationalBackgroundService;
import com.ruoyi.mgkf.service.IDoctorWorkExperienceService;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Log;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.enums.BusinessType;
import com.ruoyi.mgkf.domain.Doctor;
import com.ruoyi.mgkf.service.IDoctorService;
import com.ruoyi.common.utils.poi.ExcelUtil;
import com.ruoyi.common.core.page.TableDataInfo;

/**
 * 医师
 */
@RestController
@RequestMapping("/mgkf/doctor")
public class DoctorController extends BaseController {

    @Autowired
    private IDoctorService doctorService;

    @Resource
    private IDoctorEducationalBackgroundService doctorEducationalBackgroundService;

    @Resource
    private IDoctorWorkExperienceService doctorWorkExperienceService;

    /**
     * 查询医师列表
     */
    @GetMapping("/list")
    public TableDataInfo<Doctor> list(Doctor doctor) {
        startPage();
        List<Doctor> list = doctorService.selectDoctorList(doctor);
        doctorService.handlerDoctorList(list, List.of("selectRehabilitationCenter", "selectEducationalBackground", "selectWorkExperience"));
        return getDataTable(list);
    }

    /**
     * 获取医师详细信息
     */
    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id) {
        Doctor doctor = doctorService.selectDoctorById(id);
        if (doctor != null) {
            doctorService.handlerDoctorList(List.of(doctor), List.of("selectRehabilitationCenter", "selectEducationalBackground", "selectWorkExperience"));
        }
        return success(doctor);
    }

    /**
     * 新增医师
     */
    @Log(title = "医师", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody Doctor doctor) {
        int updateRow = doctorService.insertDoctor(doctor);
        if (updateRow > 0) {
            doctorEducationalBackgroundService.insertOrUpdateBatch(doctor.getId(), doctor.getDoctorEducationalBackgroundList());
            doctorWorkExperienceService.insertOrUpdateBatch(doctor.getId(), doctor.getDoctorWorkExperienceList());
        }
        return toAjax(updateRow);
    }

    /**
     * 修改医师
     */
    @Log(title = "医师", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody Doctor doctor) {
        int updateRow = doctorService.updateDoctor(doctor);
        if (updateRow > 0) {
            doctorEducationalBackgroundService.insertOrUpdateBatch(doctor.getId(), doctor.getDoctorEducationalBackgroundList());
            doctorWorkExperienceService.insertOrUpdateBatch(doctor.getId(), doctor.getDoctorWorkExperienceList());
        }
        return toAjax(updateRow);
    }

    /**
     * 删除医师
     */
    @Log(title = "医师", businessType = BusinessType.DELETE)
    @DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids) {
        int updateRow = doctorService.deleteDoctorByIds(ids);
        if (updateRow > 0) {
            doctorEducationalBackgroundService.deleteByDoctorIds(ids);
            doctorWorkExperienceService.deleteByDoctorIds(ids);
        }
        return toAjax(updateRow);
    }
}
