import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormItem,
} from '@ant-design/pro-components';
import { Col, Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import Editor from '@/components/Editor/Editor';
import FileUpload from '@/components/FileUpload';
import GoogleMapsPicker from '@/components/GoogleMapsPicker';

export type CenterFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  coverImage?: string;
  backgroundImages?: string[];
  nameZh?: string;
  nameEn?: string;
  longitude?: string;
  latitude?: string;
  address?: string;
  addressInfo?: {
    address: string;
    latitude: number;
    longitude: number;
  };
  detailZh?: string;
  detailEn?: string;
  star?: number;
  commentNum?: number;
};

export type CenterFormProps = {
  onCancel: (flag?: boolean, formVals?: CenterFormData) => void;
  onSubmit: (values: CenterFormData) => Promise<void>;
  open: boolean;
  values: Partial<CenterFormData>;
};

const CenterForm: React.FC<CenterFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      coverImage: props.values.coverImage,
      backgroundImages: typeof props.values.backgroundImages === 'string' ? props.values.backgroundImages.split(',') : props.values.backgroundImages || [],
      nameZh: props.values.nameZh,
      nameEn: props.values.nameEn,
      longitude: props.values.longitude,
      latitude: props.values.latitude,
      addressInfo: props.values.address ? {
        address: props.values.address,
        latitude: props.values.latitude ? parseFloat(props.values.latitude) : 0,
        longitude: props.values.longitude ? parseFloat(props.values.longitude) : 0,
      } : undefined,
      address: props.values.address,
      detailZh: props.values.detailZh,
      detailEn: props.values.detailEn,
      star: props.values.star,
      commentNum: props.values.commentNum,
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
    const submitData: CenterFormData = {
      ...values as CenterFormData,
      backgroundImages: values.backgroundImages?.join(','),
    };
    
    // 处理地址信息
    if (values.addressInfo) {
      submitData.address = values.addressInfo.address;
      submitData.latitude = values.addressInfo.latitude.toString();
      submitData.longitude = values.addressInfo.longitude.toString();
    }
    
    props.onSubmit(submitData);
  };

  return (
    <Modal
      width={800}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.healthCareCenter.editTitle',
            defaultMessage: '编辑康复中心',
          })
        : intl.formatMessage({
            id: 'pages.healthCareCenter.addTitle',
            defaultMessage: '新增康复中心',
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
            id: 'pages.healthCareCenter.id',
            defaultMessage: '主键ID',
          })} 
          disabled 
          hidden={true} 
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.healthCareCenter.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.healthCareCenter.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.healthCareCenter.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameZh"
          label={intl.formatMessage({
            id: 'pages.healthCareCenter.nameZh',
            defaultMessage: '康复中心名称(中文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.healthCareCenter.nameZhPlaceholder',
            defaultMessage: '请输入康复中心名称(中文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.healthCareCenter.nameZhRequired',
                defaultMessage: '请输入康复中心名称(中文)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameEn"
          label={intl.formatMessage({
            id: 'pages.healthCareCenter.nameEn',
            defaultMessage: '康复中心名称(英文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.healthCareCenter.nameEnPlaceholder',
            defaultMessage: '请输入康复中心名称(英文)',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.healthCareCenter.nameEnRequired',
                defaultMessage: '请输入康复中心名称(英文)！',
              }),
            },
          ]}
        />
       <Col span={24}>

        <ProFormItem
          label={intl.formatMessage({
            id: 'pages.healthCareCenter.coverImage',
            defaultMessage: '封面图片',
          })}
          name="coverImage"
        >
          <FileUpload
            maxCount={1}
            accept="image/*"
            uploadText={intl.formatMessage({
              id: 'pages.healthCareCenter.uploadCoverImage',
              defaultMessage: '上传封面图片',
            })}
            maxSize={5}
          />
        </ProFormItem>
        </Col>
       <Col span={24}>
        <ProFormItem
          label={intl.formatMessage({
            id: 'pages.healthCareCenter.backgroundImages',
            defaultMessage: '背景图片',
          })}
          name="backgroundImages"
        >
          <FileUpload
            maxCount={10}
            accept="image/*"
            uploadText={intl.formatMessage({
              id: 'pages.healthCareCenter.uploadBackgroundImages',
              defaultMessage: '上传背景图片',
            })}
            multiple
            maxSize={10}
          />
        </ProFormItem>
        </Col>


        <ProFormItem
          name="addressInfo"
          label={intl.formatMessage({
            id: 'pages.healthCareCenter.address',
            defaultMessage: '地址',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.healthCareCenter.addressRequired',
                defaultMessage: '请选择地址！',
              }),
            },
          ]}
        >
          <GoogleMapsPicker
            placeholder={intl.formatMessage({
              id: 'pages.healthCareCenter.addressPlaceholder',
              defaultMessage: '请选择地址',
            })}
          />
        </ProFormItem>
        <Col span={24}>
          <ProFormItem
            name="detailZh"
            label={intl.formatMessage({
              id: 'pages.healthCareCenter.detailZh',
              defaultMessage: '详情介绍(中文)',
            })}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.healthCareCenter.detailZhRequired',
                  defaultMessage: '请输入详情介绍(中文)！',
                }),
              },
            ]}
          >
            <Editor />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            name="detailEn"
            label={intl.formatMessage({
              id: 'pages.healthCareCenter.detailEn',
              defaultMessage: '详情介绍(英文)',
            })}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.healthCareCenter.detailEnRequired',
                  defaultMessage: '请输入详情介绍(英文)！',
                }),
              },
            ]}
          >
            <Editor />
          </ProFormItem>
        </Col>
      </ProForm>
    </Modal>
  );
};

export default CenterForm;
