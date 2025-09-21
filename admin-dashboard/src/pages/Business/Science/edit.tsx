import React, { useEffect,useState } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProFormItem,
} from '@ant-design/pro-components';
import { Form, Modal, Col } from 'antd';
import FileUpload from '@/components/FileUpload';
import { useIntl, FormattedMessage } from '@umijs/max';
import Editor from '@/components/Editor/Editor';


export type ScienceFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  titleZh?: string;
  titleEn?: string;
  contentZh?: string;
  contentEn?: string;
  detailImages?: string;
  detailVideos?: string;
  coverImage?: string;
  coverVideo?: string;
  author?: string;
  status?: string;
  scienceCategoryId?: string;
};

export type ScienceFormProps = {
  onCancel: (flag?: boolean, formVals?: ScienceFormData) => void;
  onSubmit: (values: ScienceFormData) => Promise<void>;
  open: boolean;
  values: Partial<ScienceFormData>;
  categoryOptions: ScienceCategory[];
};

type ScienceCategory = {
  id: string;
  name: string;
};


const ScienceForm: React.FC<ScienceFormProps> = (props) => {


  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      titleZh: props.values.titleZh,
      titleEn: props.values.titleEn,
      contentZh: props.values.contentZh,
      contentEn: props.values.contentEn,
      scienceCategoryId: props.values.scienceCategoryId,
      detailImages: props.values.detailImages ? props.values.detailImages.split(',') : [],
      detailVideos: props.values.detailVideos ? props.values.detailVideos.split(',') : [],
      coverImage: props.values.coverImage,
      coverVideo: props.values.coverVideo,
      status: props.values.status,
      sort: props.values.sort,
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
      ...values as ScienceFormData,
      detailImages: values.detailImages?.join(','),
      detailVideos: values.detailVideos?.join(','),
    });
  };

  return (
    <Modal
      width={800}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.science.editTitle',
            defaultMessage: '编辑科普',
          })
        : intl.formatMessage({
            id: 'pages.science.addTitle',
            defaultMessage: '新增科普',
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
            id: 'pages.science.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.science.createDept',
            defaultMessage: '创建部门',
          })} hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.science.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.science.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormSelect
          name="scienceCategoryId"
          label={intl.formatMessage({
            id: 'pages.science.category',
            defaultMessage: '分类',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.science.categoryPlaceholder',
            defaultMessage: '请选择分类',
          })}
          options={props.categoryOptions}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.science.categoryRequired',
                defaultMessage: '请选择分类！',
              }),
            },
          ]}
        />
        <ProFormText
          name="titleZh"
          label={intl.formatMessage({
            id: 'pages.science.titleZh',
            defaultMessage: '标题(中)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.science.titleZhPlaceholder',
            defaultMessage: '请输入标题(中)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.science.titleZhRequired',
                defaultMessage: '请输入标题！',
              }),
            },
          ]}
        />

         <ProFormText
          name="titleEn"
          label={intl.formatMessage({
            id: 'pages.science.titleEn',
            defaultMessage: '标题(英)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.science.titleEnPlaceholder',
            defaultMessage: '请输入标题(英)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.science.titleEnRequired',
                defaultMessage: '请输入标题！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.science.coverImage',
              defaultMessage: '封面图片',
            })}
            name="coverImage"
          >
            <FileUpload
              maxCount={1}
              accept="image/*"
              uploadText={intl.formatMessage({
                id: 'pages.science.uploadCoverImage',
                defaultMessage: '上传封面图片',
              })}
              maxSize={10}
            />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.science.coverVideo',
              defaultMessage: '封面视频',
            })}
            name="coverVideo"
          >
            <FileUpload
              maxCount={1}
              accept="video/*"
              uploadText={intl.formatMessage({
                id: 'pages.science.uploadCoverVideo',
                defaultMessage: '上传封面视频',
              })}
              maxSize={100}
            />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.science.detailImages',
              defaultMessage: '详情图片',
            })}
            name="detailImages"
          >
            <FileUpload
              maxCount={20}
              accept="image/*"
              uploadText={intl.formatMessage({
                id: 'pages.science.uploadDetailImages',
                defaultMessage: '上传详情图片',
              })}
              multiple
              maxSize={10}
            />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.science.detailVideos',
              defaultMessage: '详情视频',
            })}
            name="detailVideos"
          >
            <FileUpload
              maxCount={10}
              accept="video/*"
              uploadText={intl.formatMessage({
                id: 'pages.science.uploadDetailVideos',
                defaultMessage: '上传详情视频',
              })}
              multiple
              maxSize={100}
            />
          </ProFormItem>
        </Col>
<Col span={24}>
          <ProFormItem
            name="contentZh"
            label={intl.formatMessage({
              id: 'pages.science.contentZh',
              defaultMessage: '内容(中)',
            })}
            required={true}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.science.contentZhRequired',
                  defaultMessage: '请输入内容(中)！',
                }),
              },
            ]}
          >
            <Editor />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            name="contentEn"
            label={intl.formatMessage({
              id: 'pages.science.contentEn',
              defaultMessage: '内容(英)',
            })}
            required={true}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.science.contentEnRequired',
                  defaultMessage: '请输入内容(英)！',
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

export default ScienceForm;
