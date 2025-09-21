import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';

export type UserFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  status?: string;
};

export type UserFormProps = {
  onCancel: (flag?: boolean, formVals?: UserFormData) => void;
  onSubmit: (values: UserFormData) => Promise<void>;
  open: boolean;
  values: Partial<UserFormData>;
};

const UserForm: React.FC<UserFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      username: props.values.username,
      nickname: props.values.nickname,
      email: props.values.email,
      phone: props.values.phone,
      avatar: props.values.avatar,
      gender: props.values.gender,
      birthday: props.values.birthday,
      address: props.values.address,
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
    props.onSubmit(values as UserFormData);
  };

  return (
    <Modal
      width={800}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.user.editTitle',
            defaultMessage: '编辑用户',
          })
        : intl.formatMessage({
            id: 'pages.user.addTitle',
            defaultMessage: '新增用户',
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
            id: 'pages.user.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.user.createDept',
            defaultMessage: '创建部门',
          })} hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.user.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormText
          name="username"
          label={intl.formatMessage({
            id: 'pages.user.username',
            defaultMessage: '用户名',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.usernamePlaceholder',
            defaultMessage: '请输入用户名',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.user.usernameRequired',
                defaultMessage: '请输入用户名！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nickname"
          label={intl.formatMessage({
            id: 'pages.user.nickname',
            defaultMessage: '昵称',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.nicknamePlaceholder',
            defaultMessage: '请输入昵称',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.nicknameRequired',
                defaultMessage: '请输入昵称！',
              }),
            },
          ]}
        />
        <ProFormText
          name="email"
          label={intl.formatMessage({
            id: 'pages.user.email',
            defaultMessage: '邮箱',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.emailPlaceholder',
            defaultMessage: '请输入邮箱',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.emailRequired',
                defaultMessage: '请输入邮箱！',
              }),
            },
            {
              type: 'email',
              message: intl.formatMessage({
                id: 'pages.user.emailFormat',
                defaultMessage: '请输入正确的邮箱格式！',
              }),
            },
          ]}
        />
        <ProFormText
          name="phone"
          label={intl.formatMessage({
            id: 'pages.user.phone',
            defaultMessage: '手机号',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.phonePlaceholder',
            defaultMessage: '请输入手机号',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.phoneRequired',
                defaultMessage: '请输入手机号！',
              }),
            },
          ]}
        />
        <ProFormText
          name="avatar"
          label={intl.formatMessage({
            id: 'pages.user.avatar',
            defaultMessage: '头像',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.avatarPlaceholder',
            defaultMessage: '请输入头像URL',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.avatarRequired',
                defaultMessage: '请输入头像URL！',
              }),
            },
          ]}
        />
        <ProFormSelect
          name="gender"
          label={intl.formatMessage({
            id: 'pages.user.gender',
            defaultMessage: '性别',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.genderPlaceholder',
            defaultMessage: '请选择性别',
          })}
          options={[
            { 
              label: intl.formatMessage({
                id: 'pages.user.genderMale',
                defaultMessage: '男',
              }), 
              value: '1' 
            },
            { 
              label: intl.formatMessage({
                id: 'pages.user.genderFemale',
                defaultMessage: '女',
              }), 
              value: '2' 
            },
            { 
              label: intl.formatMessage({
                id: 'pages.user.genderUnknown',
                defaultMessage: '未知',
              }), 
              value: '0' 
            },
          ]}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.genderRequired',
                defaultMessage: '请选择性别！',
              }),
            },
          ]}
        />
        <ProFormDatePicker
          name="birthday"
          label={intl.formatMessage({
            id: 'pages.user.birthday',
            defaultMessage: '生日',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.birthdayPlaceholder',
            defaultMessage: '请选择生日',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.birthdayRequired',
                defaultMessage: '请选择生日！',
              }),
            },
          ]}
        />
        <ProFormTextArea
          name="address"
          label={intl.formatMessage({
            id: 'pages.user.address',
            defaultMessage: '地址',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.user.addressPlaceholder',
            defaultMessage: '请输入地址',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.user.addressRequired',
                defaultMessage: '请输入地址！',
              }),
            },
          ]}
        />
        <ProFormSelect
          name="status"
          label={intl.formatMessage({
            id: 'pages.user.status',
            defaultMessage: '状态',
          })}
          placeholder="请选择状态"
          options={[
            { label: '正常', value: '0' },
            { label: '停用', value: '1' },
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

export default UserForm;