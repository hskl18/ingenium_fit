import React, { useEffect } from 'react';
import { ProForm, ProFormItem, ProFormText } from '@ant-design/pro-components';
import { Col, Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import Editor from '@/components/Editor/Editor';
export type AgreementFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  titleZh?: string;
  titleEn?: string;
  contentZh?: string;
  contentEn?: string;
  code?: string;
};

export type AgreementFormProps = {
  onCancel: (flag?: boolean, formVals?: AgreementFormData) => void;
  onSubmit: (values: AgreementFormData) => Promise<void>;
  open: boolean;
  values: Partial<AgreementFormData>;
};

const AgreementForm: React.FC<AgreementFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    console.log('props.values', props.values);
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      titleZh: props.values.titleZh,
      titleEn: props.values.titleEn,
      contentZh: props.values.contentZh,
      contentEn: props.values.contentEn,
      code: props.values.code,
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
    console.log('values', values);
    props.onSubmit(values as AgreementFormData);
  };

  return (
    <Modal
      width={640}
      title={
        props.values.id
          ? intl.formatMessage({
              id: 'pages.agreement.editTitle',
              defaultMessage: '编辑协议',
            })
          : intl.formatMessage({
              id: 'pages.agreement.addTitle',
              defaultMessage: '新增协议',
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
            id: 'pages.agreement.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.agreement.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.agreement.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormText
          name="titleZh"
          label={intl.formatMessage({
            id: 'pages.agreement.titleZh',
            defaultMessage: '标题(中)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.agreement.titleZhPlaceholder',
            defaultMessage: '请输入标题(中)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.agreement.titleZhRequired',
                defaultMessage: '请输入标题(中)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="titleEn"
          label={intl.formatMessage({
            id: 'pages.agreement.titleEn',
            defaultMessage: '标题(英)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.agreement.titleEnPlaceholder',
            defaultMessage: '请输入标题(英)',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.agreement.titleEnRequired',
                defaultMessage: '请输入标题(英)！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            name="contentZh"
            label={intl.formatMessage({
              id: 'pages.agreement.contentZh',
              defaultMessage: '内容(中)',
            })}
            required={true}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.agreement.contentZhRequired',
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
              id: 'pages.agreement.contentEn',
              defaultMessage: '内容(英)',
            })}
            required={true}
            rules={[
              {
                required: false,
                message: intl.formatMessage({
                  id: 'pages.agreement.contentEnRequired',
                  defaultMessage: '请输入内容(英)！',
                }),
              },
            ]}
          >
            <Editor />
          </ProFormItem>
        </Col>
        <ProFormText
          name="code"
          label={intl.formatMessage({
            id: 'pages.agreement.code',
            defaultMessage: '协议编码',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.agreement.codePlaceholder',
            defaultMessage: '请输入协议编码',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.agreement.codeRequired',
                defaultMessage: '请输入协议编码！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default AgreementForm;
