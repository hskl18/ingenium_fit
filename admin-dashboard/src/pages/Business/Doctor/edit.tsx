import React, { useEffect, useState } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormItem,
  ProFormSelect,
  ProFormList,
  ProFormDatePicker,
  FormControlRender,
} from '@ant-design/pro-components';
import { Col, Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import TagsGroup from '@/components/TagsGroup/TagsGroup';
import FileUpload from '@/components/FileUpload';
import { listCenter } from '@/services/business/center';

export type DoctorFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  rehabilitationCenterId?: string;
  nameZh?: string;
  nameEn?: string;
  positionTitleZh?: string;
  positionTitleEn?: string;
  headImage?: string;
  backgroundImages?: string | string[];
  tagsZh?: string;
  tagsEn?: string;
  positionRangeZh?: string;
  positionRangeEn?: string;
  doctorEducationalBackgroundList?: {
    startTime?: string;
    endTime?: string;
    qualificationZh?: string;
    qualificationEn?: string;
  }[];
  doctorWorkExperienceList?: {
    startTime?: string;
    endTime?: string;
    positionZh?: string;
    positionEn?: string;
    contentZh?: string;
    contentEn?: string;
  }[];
};

export type DoctorFormProps = {
  onCancel: (flag?: boolean, formVals?: DoctorFormData) => void;
  onSubmit: (values: DoctorFormData) => Promise<void>;
  open: boolean;
  values: Partial<DoctorFormData>;
};

const DoctorForm: React.FC<DoctorFormProps> = (props) => {
  const [form] = Form.useForm();
  const [centerOptions, setCenterOptions] = useState<any[]>([]);

  const fetchCenterOptions = async () => {
    const res = await listCenter();
    if (res.code === 200) {
      setCenterOptions(
        res.rows.map((item: any) => ({
          label: item.nameZh,
          value: item.id,
        })),
      );
    }
  };

  useEffect(() => {
    fetchCenterOptions();
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      rehabilitationCenterId: props.values.rehabilitationCenterId,
      nameZh: props.values.nameZh,
      nameEn: props.values.nameEn,
      tagsZh: props.values.tagsZh,
      tagsEn: props.values.tagsEn,
      positionTitleZh: props.values.positionTitleZh,
      positionTitleEn: props.values.positionTitleEn,
      positionRangeZh: props.values.positionRangeZh,
      positionRangeEn: props.values.positionRangeEn,
      headImage: props.values.headImage,
      backgroundImages:
        typeof props.values.backgroundImages === 'string'
          ? props.values.backgroundImages.split(',').filter(Boolean)
          : props.values.backgroundImages,
      doctorEducationalBackgroundList: props.values.doctorEducationalBackgroundList || [],
      doctorWorkExperienceList: props.values.doctorWorkExperienceList || [],
    });
  }, [form, props]);

  const intl = useIntl();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit({
      ...(values as DoctorFormData),
      backgroundImages: Array.isArray(values.backgroundImages)
        ? values.backgroundImages.join(',')
        : values.backgroundImages,
    });
  };

  return (
    <Modal
      width={800}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.doctor.editTitle',
            defaultMessage: '编辑医师',
          })
        : intl.formatMessage({
            id: 'pages.doctor.addTitle',
            defaultMessage: '新增医师',
          })
      }
      open={props.open}
      forceRender
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        submitter={false}
        layout="horizontal"
        onFinish={handleFinish}
      >
        <ProFormText 
          name="id" 
          label={intl.formatMessage({
            id: 'pages.doctor.id',
            defaultMessage: '主键ID',
          })} 
          disabled 
          hidden={true} 
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.doctor.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.doctor.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormSelect
          name="rehabilitationCenterId"
          label={intl.formatMessage({
            id: 'pages.doctor.rehabilitationCenter',
            defaultMessage: '康复中心',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.rehabilitationCenterPlaceholder',
            defaultMessage: '请选择康复中心',
          })}
          options={centerOptions}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.rehabilitationCenterRequired',
                defaultMessage: '请选择康复中心！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameZh"
          label={intl.formatMessage({
            id: 'pages.doctor.nameZh',
            defaultMessage: '医师名称(中文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.nameZhPlaceholder',
            defaultMessage: '请输入医师名称(中文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.nameZhRequired',
                defaultMessage: '请输入医师名称(中文)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameEn"
          label={intl.formatMessage({
            id: 'pages.doctor.nameEn',
            defaultMessage: '医师名称(英文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.nameEnPlaceholder',
            defaultMessage: '请输入医师名称(英文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.nameEnRequired',
                defaultMessage: '请输入医师名称(英文)！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.doctor.headImage',
              defaultMessage: '头像',
            })}
            name="headImage"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.doctor.headImageRequired',
                  defaultMessage: '请上传头像！',
                }),
              },
            ]}
          >
            <FileUpload 
              maxCount={1} 
              accept="image/*" 
              uploadText={intl.formatMessage({
                id: 'pages.doctor.uploadHeadImage',
                defaultMessage: '上传头像',
              })} 
              maxSize={5} 
            />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.doctor.backgroundImages',
              defaultMessage: '背景图片',
            })}
            name="backgroundImages"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.doctor.backgroundImages.required',
                  defaultMessage: '请上传背景图片！',
                }),
              },
            ]}
          >
            <FileUpload
              maxCount={10}
              accept="image/*"
              uploadText={intl.formatMessage({
                id: 'pages.doctor.uploadBackgroundImages',
                defaultMessage: '上传背景图片',
              })}
              multiple
              maxSize={10}
            />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            name="tagsZh"
            label={intl.formatMessage({
              id: 'pages.doctor.tagsZh',
              defaultMessage: '标签(中文)',
            })}
          >
            <TagsGroup />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            name="tagsEn"
            label={intl.formatMessage({
              id: 'pages.doctor.tagsEn',
              defaultMessage: '标签(英文)',
            })}
          >
            <TagsGroup />
          </ProFormItem>
        </Col>
        <ProFormText
          name="positionTitleZh"
          label={intl.formatMessage({ id: 'pages.doctor.positionTitleZh', defaultMessage: '职称(中文)' })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.positionTitleZh.placeholder',
            defaultMessage: '请输入职称(中文)',
          })}
          colProps={{ span: 12 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.positionTitleZh.required',
                defaultMessage: '请输入职称(中文)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="positionTitleEn"
          label={intl.formatMessage({ id: 'pages.doctor.positionTitleEn', defaultMessage: '职称(英文)' })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.positionTitleEn.placeholder',
            defaultMessage: '请输入职称(英文)',
          })}
          colProps={{ span: 12 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.positionTitleEn.required',
                defaultMessage: '请输入职称(英文)！',
              }),
            },
          ]}
        />

        <ProFormText
          name="positionRangeZh"
          label={intl.formatMessage({
            id: 'pages.doctor.positionRangeZh',
            defaultMessage: '职业范围(中文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.positionRangeZh.placeholder',
            defaultMessage: '请输入职业范围(中文)',
          })}
          colProps={{ span: 12 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.positionRangeZh.required',
                defaultMessage: '请输入职业范围(中文)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="positionRangeEn"
          label={intl.formatMessage({
            id: 'pages.doctor.positionRangeEn',
            defaultMessage: '职业范围(英文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.doctor.positionRangeEn.placeholder',
            defaultMessage: '请输入职业范围(英文)',
          })}
          colProps={{ span: 12 }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.doctor.positionRangeEn.required',
                defaultMessage: '请输入职业范围(英文)！',
              }),
            },
          ]}
        />

        <Col span={24}>
          <ProFormList
            name="doctorEducationalBackgroundList"
            label={intl.formatMessage({
              id: 'pages.doctor.educationalBackground',
              defaultMessage: '教育背景',
            })}
            creatorButtonProps={{
              creatorButtonText: intl.formatMessage({
                id: 'pages.doctor.addEducationalBackground',
                defaultMessage: '添加教育背景',
              }),
            }}
            min={0}
            copyIconProps={false}
            itemRender={({ listDom, action }) => (
              <div style={{ border: '1px solid #d9d9d9', padding: '16px', marginBottom: '8px', borderRadius: '6px' }}>
                {listDom}
                {action}
              </div>
            )}
          >
            <ProFormDatePicker
              name="startTime"
              label={intl.formatMessage({ id: 'pages.doctor.startTime', defaultMessage: '开始时间' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.startTime.placeholder',
                defaultMessage: '请选择开始时间',
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.startTime.required',
                    defaultMessage: '请选择开始时间！',
                  }),
                },
              ]}
            />
            <ProFormDatePicker
              name="endTime"
              label={intl.formatMessage({ id: 'pages.doctor.endTime', defaultMessage: '结束时间' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.endTime.placeholder',
                defaultMessage: '请选择结束时间',
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.endTime.required',
                    defaultMessage: '请选择结束时间！',
                  }),
                },
              ]}
            />
            <ProFormText
              name="qualificationZh"
              label={intl.formatMessage({
                id: 'pages.doctor.qualificationZh',
                defaultMessage: '学历/资格(中文)',
              })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.qualificationZh.placeholder',
                defaultMessage: '请输入学历/资格(中文)',
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.qualificationZh.required',
                    defaultMessage: '请输入学历/资格(中文)！',
                  }),
                },
              ]}
            />
            <ProFormText
              name="qualificationEn"
              label={intl.formatMessage({
                id: 'pages.doctor.qualificationEn',
                defaultMessage: '学历/资格(英文)',
              })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.qualificationEn.placeholder',
                defaultMessage: '请输入学历/资格(英文)',
              })}
              rules={[
                {
                  required: false,
                  message: intl.formatMessage({
                    id: 'pages.doctor.qualificationEn.required',
                    defaultMessage: '请输入学历/资格(英文)！',
                  }),
                },
              ]}
            />
          </ProFormList>
        </Col>

        <Col span={24}>
          <ProFormList
              name="doctorWorkExperienceList"
              label={intl.formatMessage({
                id: 'pages.doctor.workExperience',
                defaultMessage: '工作经历',
              })}
              creatorButtonProps={{
                creatorButtonText: intl.formatMessage({
                  id: 'pages.doctor.addWorkExperience',
                  defaultMessage: '添加工作经历',
                }),
              }}
            min={0}
            copyIconProps={false}
            itemRender={({ listDom, action }) => (
              <div style={{ border: '1px solid #d9d9d9', padding: '16px', marginBottom: '8px', borderRadius: '6px' }}>
                {listDom}
                {action}
              </div>
            )}
          >
            <ProFormDatePicker
              name="startTime"
              label={intl.formatMessage({ id: 'pages.doctor.startTime', defaultMessage: '开始时间' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.startTime.placeholder',
                defaultMessage: '请选择开始时间',
              })}
              colProps={{ span: 12 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.startTime.required',
                    defaultMessage: '请选择开始时间！',
                  }),
                },
              ]}
            />
            <ProFormDatePicker
              name="endTime"
              label={intl.formatMessage({ id: 'pages.doctor.endTime', defaultMessage: '结束时间' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.endTime.placeholder',
                defaultMessage: '请选择结束时间',
              })}
              colProps={{ span: 12 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.endTime.required',
                    defaultMessage: '请选择结束时间！',
                  }),
                },
              ]}
            />
            <ProFormText
              name="positionZh"
              label={intl.formatMessage({ id: 'pages.doctor.positionZh', defaultMessage: '职位(中文)' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.positionZh.placeholder',
                defaultMessage: '请输入职位(中文)',
              })}
              colProps={{ span: 12 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.positionZh.required',
                    defaultMessage: '请输入职位(中文)！',
                  }),
                },
              ]}
            />
            <ProFormText
              name="positionEn"
              label={intl.formatMessage({ id: 'pages.doctor.positionEn', defaultMessage: '职位(英文)' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.positionEn.placeholder',
                defaultMessage: '请输入职位(英文)',
              })}
              colProps={{ span: 12 }}
              rules={[
                {
                  required: false,
                  message: intl.formatMessage({
                    id: 'pages.doctor.positionEn.required',
                    defaultMessage: '请输入职位(英文)！',
                  }),
                },
              ]}
            />
            <ProFormTextArea
              name="contentZh"
              label={intl.formatMessage({ id: 'pages.doctor.contentZh', defaultMessage: '工作内容(中文)' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.contentZh.placeholder',
                defaultMessage: '请输入工作内容(中文)',
              })}
              colProps={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.doctor.contentZh.required',
                    defaultMessage: '请输入工作内容(中文)！',
                  }),
                },
              ]}
            />
            <ProFormTextArea
              name="contentEn"
              label={intl.formatMessage({ id: 'pages.doctor.contentEn', defaultMessage: '工作内容(英文)' })}
              placeholder={intl.formatMessage({
                id: 'pages.doctor.contentEn.placeholder',
                defaultMessage: '请输入工作内容(英文)',
              })}
              colProps={{ span: 24 }}
              rules={[
                {
                  required: false,
                  message: intl.formatMessage({
                    id: 'pages.doctor.contentEn.required',
                    defaultMessage: '请输入工作内容(英文)！',
                  }),
                },
              ]}
            />
          </ProFormList>
        </Col>
      </ProForm>
    </Modal>
  );
};

export default DoctorForm;
