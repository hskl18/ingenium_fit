import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';

export type LeaveMessageFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  username?: string;
  email?: string;
  phone?: string;
  content?: string;
  status?: string;
};

export type LeaveMessageFormProps = {
  onCancel: (flag?: boolean, formVals?: LeaveMessageFormData) => void;
  onSubmit: (values: LeaveMessageFormData) => Promise<void>;
  open: boolean;
  values: Partial<LeaveMessageFormData>;
};

const LeaveMessageForm: React.FC<LeaveMessageFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      username: props.values.username,
      email: props.values.email,
      phone: props.values.phone,
      content: props.values.content,
      status: props.values.status,
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
    props.onSubmit(values as LeaveMessageFormData);
  };

  return (
    <Modal
      width={800}
      title={props.values.id ? '编辑留言' : '新增留言'}
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
          label="主键ID"
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label="创建部门" hidden={true}
          placeholder="请输入创建部门"
          rules={[
            {
              required: false,
              message: '请输入创建部门！',
            },
          ]}
        />
        <ProFormText
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名！',
            },
          ]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          placeholder="请输入邮箱"
          rules={[
            {
              required: false,
              message: '请输入邮箱！',
            },
            {
              type: 'email',
              message: '请输入正确的邮箱格式！',
            },
          ]}
        />
        <ProFormText
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          rules={[
            {
              required: false,
              message: '请输入手机号！',
            },
          ]}
        />
        <ProFormTextArea
          name="content"
          label="留言内容"
          placeholder="请输入留言内容"
          rules={[
            {
              required: true,
              message: '请输入留言内容！',
            },
          ]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          placeholder="请选择状态"
          options={[
            { label: '待处理', value: '0' },
            { label: '已处理', value: '1' },
            { label: '已关闭', value: '2' },
          ]}
          rules={[
            {
              required: false,
              message: '请选择状态！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default LeaveMessageForm;
