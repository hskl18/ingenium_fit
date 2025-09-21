import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormItem,
} from '@ant-design/pro-components';
import { Form, Modal, Col } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import FileUpload from '@/components/FileUpload';

export type FaqsFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  sort?: number;
  titleZh?: string;
  titleEn?: string;
  contentZh?: string;
  contentEn?: string;
  images?: string;
};

export type FaqsFormProps = {
  onCancel: (flag?: boolean, formVals?: FaqsFormData) => void;
  onSubmit: (values: FaqsFormData) => Promise<void>;
  open: boolean;
  values: Partial<FaqsFormData>;
};

const FaqsForm: React.FC<FaqsFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      sort: props.values.sort,
      titleZh: props.values.titleZh,
      titleEn: props.values.titleEn,
      contentZh: props.values.contentZh,
      contentEn: props.values.contentEn,
      images: props.values.images ? props.values.images.split(',') : [],
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
      ...values as FaqsFormData,
      images: values.images?.join(','),
    });
  };

  return (
    <Modal
      width={800}
      title={props.values.id
        ? intl.formatMessage({
            id: 'pages.faq.editTitle',
            defaultMessage: '编辑常见问题',
          })
        : intl.formatMessage({
            id: 'pages.faq.addTitle',
            defaultMessage: '新增常见问题',
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
            id: 'pages.faq.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />

        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.faq.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.faq.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.faq.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />

        <ProFormText
          name="titleZh"
          label={intl.formatMessage({
            id: 'pages.faq.questionZh',
            defaultMessage: '问题(中文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.faq.questionZhPlaceholder',
            defaultMessage: '请输入问题(中文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.faq.questionZhRequired',
                defaultMessage: '请输入问题(中文)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="titleEn"
          label={intl.formatMessage({
            id: 'pages.faq.questionEn',
            defaultMessage: '问题(英文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.faq.questionEnPlaceholder',
            defaultMessage: '请输入问题(英文)',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.faq.questionEnRequired',
                defaultMessage: '请输入问题(英文)！',
              }),
            },
          ]}
        />
        <ProFormTextArea
          name="contentZh"
          label={intl.formatMessage({
            id: 'pages.faq.answerZh',
            defaultMessage: '答案(中文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.faq.answerZhPlaceholder',
            defaultMessage: '请输入答案(中文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.faq.answerZhRequired',
                defaultMessage: '请输入答案(中文)！',
              }),
            },
          ]}
        />
        <ProFormTextArea
          name="contentEn"
          label={intl.formatMessage({
            id: 'pages.faq.answerEn',
            defaultMessage: '答案(英文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.faq.answerEnPlaceholder',
            defaultMessage: '请输入答案(英文)',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.faq.answerEnRequired',
                defaultMessage: '请输入答案(英文)！',
              }),
            },
          ]}
        />
        <Col span={24}>
        <ProFormItem
          label={intl.formatMessage({
            id: 'pages.faq.images',
            defaultMessage: '图片',
          })}
          name="images"
        >
          <FileUpload
            maxCount={9}
            accept="image/*"
            uploadText={intl.formatMessage({
              id: 'pages.faq.uploadImages',
              defaultMessage: '上传图片',
            })}
            multiple
            maxSize={10}
          />
        </ProFormItem>
        </Col>
          <ProFormDigit
          name="sort"
          label={intl.formatMessage({
            id: 'pages.faq.sort',
            defaultMessage: '排序',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.faq.sortPlaceholder',
            defaultMessage: '请输入排序',
          })}
          min={0}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.faq.sortRequired',
                defaultMessage: '请输入排序！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default FaqsForm;
