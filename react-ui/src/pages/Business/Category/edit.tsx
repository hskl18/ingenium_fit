import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';

export type CategoryFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  nameZh?: string;
  nameEn?: string;
  sort?: number;
};

export type CategoryFormProps = {
  onCancel: (flag?: boolean, formVals?: CategoryFormData) => void;
  onSubmit: (values: CategoryFormData) => Promise<void>;
  open: boolean;
  values: Partial<CategoryFormData>;
};

const CategoryForm: React.FC<CategoryFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      nameZh: props.values.nameZh,
      nameEn: props.values.nameEn,
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
    props.onSubmit(values as CategoryFormData);
  };

  return (
    <Modal
      width={640}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.category.editTitle',
            defaultMessage: '编辑动态帖子分类',
          })
        : intl.formatMessage({
            id: 'pages.category.addTitle',
            defaultMessage: '新增动态帖子分类',
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
            id: 'pages.category.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.category.createDept',
            defaultMessage: '创建部门',
          })} 
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.category.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.category.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameZh"
          label={intl.formatMessage({
            id: 'pages.category.nameZh',
            defaultMessage: '分类名称(中)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.category.nameZhPlaceholder',
            defaultMessage: '请输入分类名称(中)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.category.nameZhRequired',
                defaultMessage: '请输入分类名称(中)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameEn"
          label={intl.formatMessage({
            id: 'pages.category.nameEn',
            defaultMessage: '分类名称(英)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.category.nameEnPlaceholder',
            defaultMessage: '请输入分类名称(英)',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.category.nameEnRequired',
                defaultMessage: '请输入分类名称(英)！',
              }),
            },
          ]}
        />
        <ProFormDigit
          name="sort"
          label={intl.formatMessage({
            id: 'pages.category.sort',
            defaultMessage: '排序',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.category.sortPlaceholder',
            defaultMessage: '请输入排序',
          })}
          min={0}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.category.sortRequired',
                defaultMessage: '请输入排序！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default CategoryForm;
