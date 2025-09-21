import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormItem,
  ProFormRate,
} from '@ant-design/pro-components';
import { Form, Modal, Col } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import Editor from '@/components/Editor/Editor';
import FileUpload from '@/components/FileUpload';

export type CommentFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  userId?: number;
  content?: string;
  images?: string;
  objectType?: number;
  objectId?: number;
  star?: number;
};

export type CommentFormProps = {
  onCancel: (flag?: boolean, formVals?: CommentFormData) => void;
  onSubmit: (values: CommentFormData) => Promise<void>;
  open: boolean;
  values: Partial<CommentFormData>;
};

const CommentForm: React.FC<CommentFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      userId: props.values.userId,
      content: props.values.content,
      images: props.values.images ? props.values.images.split(',') : [],
      objectType: props.values.objectType,
      objectId: props.values.objectId,
      star: props.values.star,
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
      ...values as CommentFormData,
      images: values.images?.join(','),
    });
  };

  const objectTypeOptions = [
    { label: '动态帖子', value: 1 },
    { label: '科普', value: 2 },
    { label: '康复中心', value: 3 },
    { label: '医师', value: 4 },
  ];

  return (
    <Modal
      width={800}
      title={props.values.id ? '编辑用户评论' : '新增用户评论'}
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
          label="创建部门"
          hidden={true}
          placeholder="请输入创建部门"
          rules={[
            {
              required: false,
              message: '请输入创建部门！',
            },
          ]}
        />
        <ProFormDigit
          name="userId"
          label="用户ID"
          placeholder="请输入用户ID"
          rules={[
            {
              required: true,
              message: '请输入用户ID！',
            },
          ]}
        />
        <ProFormSelect
          name="objectType"
          label="评论对象类型"
          placeholder="请选择评论对象类型"
          options={objectTypeOptions}
          rules={[
            {
              required: true,
              message: '请选择评论对象类型！',
            },
          ]}
        />
        <ProFormDigit
          name="objectId"
          label="评论对象ID"
          placeholder="请输入评论对象ID"
          rules={[
            {
              required: true,
              message: '请输入评论对象ID！',
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            name="content"
            label="评论内容"
            rules={[
              {
                required: true,
                message: '请输入评论内容！',
              },
            ]}
          >
            <Editor />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            label="图片"
            name="images"
          >
            <FileUpload
              maxCount={9}
              accept="image/*"
              uploadText="上传图片"
              multiple
              maxSize={10}
            />
          </ProFormItem>
        </Col>
        <ProFormRate
          name="star"
          label="星级评分"
          fieldProps={{
            allowHalf: false,
            count: 5,
          }}
          rules={[
            {
              required: false,
              message: '请选择星级评分！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default CommentForm;