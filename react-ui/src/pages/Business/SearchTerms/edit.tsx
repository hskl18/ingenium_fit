import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';

export type TermsFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  sort?: number;
  searchTermsZh?: string;
  searchTermsEn?: string;
};

export type TermsFormProps = {
  onCancel: (flag?: boolean, formVals?: TermsFormData) => void;
  onSubmit: (values: TermsFormData) => Promise<void>;
  open: boolean;
  values: Partial<TermsFormData>;
};

const TermsForm: React.FC<TermsFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      sort: props.values.sort,
      searchTermsZh: props.values.searchTermsZh,
      searchTermsEn: props.values.searchTermsEn,
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
    props.onSubmit(values as TermsFormData);
  };

  return (
    <Modal
      width={640}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.searchTerms.editTitle',
            defaultMessage: '编辑热门搜索词',
          })
        : intl.formatMessage({
            id: 'pages.searchTerms.addTitle',
            defaultMessage: '新增热门搜索词',
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
            id: 'pages.searchTerms.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.searchTerms.createDept',
            defaultMessage: '创建部门',
          })} hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.searchTerms.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.searchTerms.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />

        <ProFormText
          name="searchTermsZh"
          label={intl.formatMessage({
            id: 'pages.searchTerms.searchTermsZh',
            defaultMessage: '搜索词(中文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTerms.searchTermsZhPlaceholder',
            defaultMessage: '请输入搜索词(中文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.searchTerms.searchTermsZhRequired',
                defaultMessage: '请输入搜索词(中文)！',
              }),
            },
          ]}
        />
        <ProFormText
          name="searchTermsEn"
          label={intl.formatMessage({
            id: 'pages.searchTerms.searchTermsEn',
            defaultMessage: '搜索词(英文)',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTerms.searchTermsEnPlaceholder',
            defaultMessage: '请输入搜索词(英文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.searchTerms.searchTermsEnRequired',
                defaultMessage: '请输入搜索词(英文)！',
              }),
            },
          ]}
        />
         <ProFormDigit
          name="sort"
          label={intl.formatMessage({
            id: 'pages.searchTerms.sort',
            defaultMessage: '排序',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.searchTerms.sortPlaceholder',
            defaultMessage: '请输入排序',
          })}
          min={0}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.searchTerms.sortRequired',
                defaultMessage: '请输入排序！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default TermsForm;
