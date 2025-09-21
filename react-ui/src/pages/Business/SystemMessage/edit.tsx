import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormItem,
} from '@ant-design/pro-components';
import { Col, Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import Editor from '@/components/Editor/Editor';

export type SystemMessageFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  titleZh?: string;
  titleEn?: string;
  sketchZh?: string;
  sketchEn?: string;
  contentZh?: string;
  contentEn?: string;
  isPublish?: string;
};

export type SystemMessageFormProps = {
  onCancel: (flag?: boolean, formVals?: SystemMessageFormData) => void;
  onSubmit: (values: SystemMessageFormData) => Promise<void>;
  open: boolean;
  values: Partial<SystemMessageFormData>;
};

const SystemMessageForm: React.FC<SystemMessageFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      titleZh: props.values.titleZh,
      titleEn: props.values.titleEn,
      sketchZh: props.values.sketchZh,
      sketchEn: props.values.sketchEn,
      contentZh: props.values.contentZh,
      contentEn: props.values.contentEn,
      isPublish: props.values.isPublish,
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
    props.onSubmit(values as SystemMessageFormData);
  };

  return (
    <Modal
      width={800}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.systemMessage.editTitle',
            defaultMessage: '编辑系统消息',
          })
        : intl.formatMessage({
            id: 'pages.systemMessage.addTitle',
            defaultMessage: '新增系统消息',
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
            id: 'pages.systemMessage.id',
            defaultMessage: '主键ID',
          })} 
          disabled 
          hidden={true} 
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.systemMessage.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.systemMessage.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.systemMessage.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />

        <ProFormText
          name="titleZh"
          label={intl.formatMessage({
            id: 'pages.systemMessage.titleZh',
            defaultMessage: '标题（中文）',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.systemMessage.titleZhPlaceholder',
            defaultMessage: '请输入标题（中文）',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.systemMessage.titleZhRequired',
                defaultMessage: '请输入标题（中文）！',
              }),
            },
          ]}
        />
        <ProFormText
          name="titleEn"
          label={intl.formatMessage({
            id: 'pages.systemMessage.titleEn',
            defaultMessage: '标题（英文）',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.systemMessage.titleEnPlaceholder',
            defaultMessage: '请输入标题（英文）',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.systemMessage.titleEnRequired',
                defaultMessage: '请输入标题（英文）！',
              }),
            },
          ]}
        />
        <ProFormText
          name="sketchZh"
          label={intl.formatMessage({
            id: 'pages.systemMessage.sketchZh',
            defaultMessage: '摘要（中文）',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.systemMessage.sketchZhPlaceholder',
            defaultMessage: '请输入摘要（中文）',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.systemMessage.sketchZhRequired',
                defaultMessage: '请输入摘要（中文）！',
              }),
            },
          ]}
        />
        <ProFormText
          name="sketchEn"
          label={intl.formatMessage({
            id: 'pages.systemMessage.sketchEn',
            defaultMessage: '摘要（英文）',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.systemMessage.sketchEnPlaceholder',
            defaultMessage: '请输入摘要（英文）',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.systemMessage.sketchEnRequired',
                defaultMessage: '请输入摘要（英文）！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            name="contentZh"
            label={intl.formatMessage({
              id: 'pages.systemMessage.contentZh',
              defaultMessage: '内容(中)',
            })}
            required={true}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.systemMessage.contentZhRequired',
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
              id: 'pages.systemMessage.contentEn',
              defaultMessage: '内容(英)',
            })}
            required={true}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.systemMessage.contentEnRequired',
                  defaultMessage: '请输入内容(英)！',
                }),
              },
            ]}
          >
            <Editor />
          </ProFormItem>
        </Col>
        <ProFormSelect
          name="isPublish"
          label={intl.formatMessage({
            id: 'pages.systemMessage.publishStatus',
            defaultMessage: '发布状态',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.systemMessage.publishStatusPlaceholder',
            defaultMessage: '请选择发布状态',
          })}
          options={[
            { 
              label: intl.formatMessage({
                id: 'pages.systemMessage.draft',
                defaultMessage: '草稿',
              }), 
              value: '2' 
            },
            { 
              label: intl.formatMessage({
                id: 'pages.systemMessage.published',
                defaultMessage: '发布',
              }), 
              value: '1' 
            },
          ]}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.systemMessage.publishStatusRequired',
                defaultMessage: '请选择发布状态！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default SystemMessageForm;
