import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormItem,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Form, Modal, Col } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import FileUpload from '@/components/FileUpload';

export type PostFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  dynamicsPostCategoryId?: number;
  whetherPublic?: string;
  content?: string;
  author?: string;
  status?: string;
  viewCount?: number;
  likeCount?: number;
  userNickname?: string;
  userAvatar?: string;
  pictures?: string;
  videos?: string;
};

export type PostFormProps = {
  categoryOptions: { label: string; value: number }[];
  onCancel: (flag?: boolean, formVals?: PostFormData) => void;
  onSubmit: (values: PostFormData) => Promise<void>;
  open: boolean;
  values: Partial<PostFormData>;
};

const PostForm: React.FC<PostFormProps> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      dynamicsPostCategoryId: props.values.dynamicsPostCategoryId || '',
      content: props.values.content,
      whetherPublic: +props.values.whetherPublic || '',
      userNickname: props.values.user?.nickName,
      userAvatar: props.values.user?.avatar,
      pictures: props.values.pictures ? props.values.pictures.split(',') : [],
      videos: props.values.videos ? props.values.videos.split(',') : [],
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
      ...(values as PostFormData),
      pictures: values.pictures?.join(','),
      videos: values.videos?.join(','),
    });
  };

  return (
    <Modal
      width={800}
      title={
        props.values.id
          ? intl.formatMessage({
              id: 'pages.post.editTitle',
              defaultMessage: '编辑动态',
            })
          : intl.formatMessage({
              id: 'pages.post.addTitle',
              defaultMessage: '新增动态',
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
            id: 'pages.post.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.post.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.post.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.post.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />
        <ProFormText
          name="userNickname"
          label={intl.formatMessage({
            id: 'pages.post.userName',
            defaultMessage: '用户名称',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.post.userNamePlaceholder',
            defaultMessage: '请输入用户名称',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.post.userNameRequired',
                defaultMessage: '请输入用户名称！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.post.userAvatar',
              defaultMessage: '用户头像',
            })}
            name="userAvatar"
          >
            <FileUpload
              maxCount={1}
              accept="image/*"
              uploadText={intl.formatMessage({
                id: 'pages.post.uploadAvatar',
                defaultMessage: '上传头像',
              })}
              maxSize={5}
            />
          </ProFormItem>
        </Col>


        <ProFormSelect
          name="dynamicsPostCategoryId"
          label={intl.formatMessage({
            id: 'pages.post.category',
            defaultMessage: '分类',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.post.categoryPlaceholder',
            defaultMessage: '请选择分类',
          })}
          options={props.categoryOptions}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.post.categoryRequired',
                defaultMessage: '请选择分类！',
              }),
            },
          ]}
        />
        <ProFormTextArea
          name="content"
          label={intl.formatMessage({
            id: 'pages.post.content',
            defaultMessage: '内容',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.post.contentPlaceholder',
            defaultMessage: '请输入内容',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.post.contentRequired',
                defaultMessage: '请输入内容！',
              }),
            },
          ]}
        />
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.post.images',
              defaultMessage: '图片',
            })}
            name="pictures"
          >
            <FileUpload
              maxCount={9}
              accept="image/*"
              uploadText={intl.formatMessage({
                id: 'pages.post.uploadImages',
                defaultMessage: '上传图片',
              })}
              multiple
              maxSize={10}
            />
          </ProFormItem>
        </Col>
        <Col span={24}>
          <ProFormItem
            label={intl.formatMessage({
              id: 'pages.post.video',
              defaultMessage: '视频',
            })}
            name="videos"
          >
            <FileUpload
              maxCount={5}
              accept="video/*"
              uploadText={intl.formatMessage({
                id: 'pages.post.uploadVideo',
                defaultMessage: '上传视频',
              })}
              multiple
              maxSize={50}
            />
          </ProFormItem>
        </Col>
        <ProFormSelect
          initialValue={1}
          name="whetherPublic"
          label={intl.formatMessage({
            id: 'pages.post.isPublic',
            defaultMessage: '是否公开',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.post.isPublicPlaceholder',
            defaultMessage: '请选择是否公开',
          })}
          options={[
            {
              label: intl.formatMessage({
                id: 'pages.common.yes',
                defaultMessage: '是',
              }),
              value: 1,
            },
            {
              label: intl.formatMessage({
                id: 'pages.common.no',
                defaultMessage: '否',
              }),
              value: 2,
            },
          ]}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.post.isPublicRequired',
                defaultMessage: '请选择是否公开！',
              }),
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};

export default PostForm;
