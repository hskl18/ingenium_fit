import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormItem,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-components';
import { Form, Modal,Col } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import FileUpload from '@/components/FileUpload';

export type ScienceCategoryFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  nameZh?: string;
  nameEn?: string;
  icon?: string;
  sort?: number;
};

export type ScienceCategoryFormProps = {
  onCancel: (flag?: boolean, formVals?: ScienceCategoryFormData) => void;
  onSubmit: (values: ScienceCategoryFormData) => Promise<void>;
  open: boolean;
  values: Partial<ScienceCategoryFormData>;
};

const ScienceCategoryForm: React.FC<ScienceCategoryFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      nameZh: props.values.nameZh,
      nameEn: props.values.nameEn,
      icon: props.values.icon,
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
    props.onSubmit(values as ScienceCategoryFormData);
  };

  return (
    <Modal
      width={640}
      title={props.values.id
        ? intl.formatMessage({
            id: 'pages.scienceCategory.editTitle',
            defaultMessage: '编辑科普分类',
          })
        : intl.formatMessage({
            id: 'pages.scienceCategory.addTitle',
            defaultMessage: '新增科普分类',
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
            id: 'pages.scienceCategory.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.scienceCategory.createDept',
            defaultMessage: '创建部门',
          })} hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.scienceCategory.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.scienceCategory.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameZh"
          label={intl.formatMessage({
            id: 'pages.scienceCategory.nameZh',
            defaultMessage: '分类名称(中)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.scienceCategory.nameZhPlaceholder',
            defaultMessage: '请输入分类名称(中)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.scienceCategory.nameZhRequired',
                defaultMessage: '请输入分类名称(中)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="nameEn"
          label={intl.formatMessage({
            id: 'pages.scienceCategory.nameEn',
            defaultMessage: '分类名称(英)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.scienceCategory.nameEnPlaceholder',
            defaultMessage: '请输入分类名称(英)',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.scienceCategory.nameEnRequired',
                defaultMessage: '请输入分类名称(英)！',
              }),
            },
          ]}
        />
         <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.scienceCategory.icon',
              defaultMessage: '分类图标',
            })}
            name="icon"
            rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.scienceCategory.iconRequired',
                defaultMessage: '请上传分类图标！',
              }),
            },
          ]}
          >
            <FileUpload
              maxCount={1}
              accept="image/*"
              uploadText={intl.formatMessage({
                id: 'pages.scienceCategory.uploadIcon',
                defaultMessage: '上传分类图标',
              })}
              maxSize={5}
            />
          </ProFormItem>
        </Col>
        <ProFormDigit
          name="sort"
          label={intl.formatMessage({
            id: 'pages.carouseImage.sort',
            defaultMessage: '排序',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.carouseImage.sortPlaceholder',
            defaultMessage: '请输入排序',
          })}
          min={0}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.carouseImage.sortRequired',
                defaultMessage: '请输入排序！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default ScienceCategoryForm;
