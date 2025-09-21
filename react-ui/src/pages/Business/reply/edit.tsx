import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormItem,
} from '@ant-design/pro-components';
import { Form, Modal, Col } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import Editor from '@/components/Editor/Editor';

export type ReplyFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  userCommentId?: number;
  content?: string;
  userId?: number;
  replyUserId?: number;
};

export type ReplyFormProps = {
  onCancel: (flag?: boolean, formVals?: ReplyFormData) => void;
  onSubmit: (values: ReplyFormData) => Promise<void>;
  open: boolean;
  values: Partial<ReplyFormData>;
};

const ReplyForm: React.FC<ReplyFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      userCommentId: props.values.userCommentId,
      content: props.values.content,
      userId: props.values.userId,
      replyUserId: props.values.replyUserId,
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
    props.onSubmit(values as ReplyFormData);
  };

  return (
    <Modal
      width={800}
      title={props.values.id 
        ? intl.formatMessage({
            id: 'pages.reply.editTitle',
            defaultMessage: '编辑评论回复',
          })
        : intl.formatMessage({
            id: 'pages.reply.addTitle',
            defaultMessage: '新增评论回复',
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
            id: 'pages.reply.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.reply.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.reply.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.reply.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormDigit
          name="userCommentId"
          label={intl.formatMessage({
            id: 'pages.reply.userCommentId',
            defaultMessage: '用户评论ID',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.reply.userCommentIdPlaceholder',
            defaultMessage: '请输入用户评论ID',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.reply.userCommentIdRequired',
                defaultMessage: '请输入用户评论ID！',
              }),
            },
          ]}
        />
        <ProFormDigit
          name="userId"
          label={intl.formatMessage({
            id: 'pages.reply.userId',
            defaultMessage: '回复用户ID',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.reply.userIdPlaceholder',
            defaultMessage: '请输入回复用户ID',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.reply.userIdRequired',
                defaultMessage: '请输入回复用户ID！',
              }),
            },
          ]}
        />
        <ProFormDigit
          name="replyUserId"
          label={intl.formatMessage({
            id: 'pages.reply.replyUserId',
            defaultMessage: '被回复用户ID',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.reply.replyUserIdPlaceholder',
            defaultMessage: '请输入被回复用户ID',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.reply.replyUserIdRequired',
                defaultMessage: '请输入被回复用户ID！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            name="content"
            label="回复内容"
            rules={[
              {
                required: true,
                message: '请输入回复内容！',
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

export default ReplyForm;