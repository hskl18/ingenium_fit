import React, { useEffect, useState, useRef } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormItem,
  ProFormDependency,
  ProTable,
  ActionType,
  ProColumns,
} from '@ant-design/pro-components';
import Editor from '@/components/Editor/Editor';
import { Col, Form, Modal, Button, Image } from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import FileUpload from '@/components/FileUpload';
import { listScience, getScience } from '@/services/business/science';
import { listPost, getPost } from '@/services/business/post';

export type ImageFormData = Record<string, unknown> & {
  id?: number;
  createDept?: string;
  sort?: number;
  objectId?: number;
  image?: string;
  contentZh?: string;
  contentEn?: string;
  // 1-图文介绍 2-科普文章 3-动态 4-个人中心页面
  type?: string;
};

export type ImageFormProps = {
  onCancel: (flag?: boolean, formVals?: ImageFormData) => void;
  onSubmit: (values: ImageFormData) => Promise<void>;
  open: boolean;
  values: Partial<ImageFormData>;
};

const ImageForm: React.FC<ImageFormProps> = (props) => {
  const intl = useIntl();

  const typeOptions = [
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typeIntroduction',
        defaultMessage: '图文介绍',
      }),
      value: 1,
    },
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typeScience',
        defaultMessage: '科普文章',
      }),
      value: 2,
    },
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typePost',
        defaultMessage: '动态',
      }),
      value: 3,
    },
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typeProfile',
        defaultMessage: '个人中心页面',
      }),
      value: 4,
    },
  ];

type ScienceListItem = {
  id?: number;
  titleZh?: string;
  titleEn?: string;
  coverImage?: string;
  scienceCategory?: {
    name?: string;
  };
};

type PostListItem = {
  id?: number;
  content?: string;
  user?: {
    nickName?: string;
    avatar?: string;
  };
  dynamicsPostCategory?: {
    name?: string;
  };
  whetherPublic?: string;
  whetherRecommend?: string;
};

  const [form] = Form.useForm();
  const [scienceModalVisible, setScienceModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [selectedScience, setSelectedScience] = useState<ScienceListItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostListItem | null>(null);
  const scienceActionRef = useRef<ActionType>();
  const postActionRef = useRef<ActionType>();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      id: props.values.id,
      createDept: props.values.createDept,
      sort: props.values.sort,
      objectId: props.values.objectId,
      contentZh: props.values.contentZh,
      contentEn: props.values.contentEn,
      image: props.values.image,
      type: props.values.type || 1,
    });

    // 如果是编辑模式且类型为科普文章，获取科普文章信息
    if (props.values.objectId && props.values.type && +props.values.type === 2) {
      fetchScienceInfo(props.values.objectId);
    }
    // 如果是编辑模式且类型为动态，获取动态信息
    if (props.values.objectId && props.values.type && +props.values.type === 3) {
      fetchPostInfo(props.values.objectId);
    }
  }, [form, props]);

  const fetchScienceInfo = async (scienceId: number) => {
    try {
      const res = await getScience(scienceId);
      if (res.code === 200) {
        setSelectedScience(res.data);
      }
    } catch (error) {
      console.error('获取科普文章信息失败:', error);
    }
  };

  const fetchPostInfo = async (postId: number) => {
    try {
      const res = await getPost(postId);
      if (res.code === 200) {
        setSelectedPost(res.data);
      }
    } catch (error) {
      console.error('获取动态信息失败:', error);
    }
  };

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as ImageFormData);
  };

  return (
    <Modal
      width={640}
      title={props.values.id
        ? intl.formatMessage({
            id: 'pages.carouseImage.editTitle',
            defaultMessage: '编辑轮播图',
          })
        : intl.formatMessage({
            id: 'pages.carouseImage.addTitle',
            defaultMessage: '新增轮播图',
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
            id: 'pages.carouseImage.id',
            defaultMessage: '主键ID',
          })}
          disabled
          hidden={true}
        />
        <ProFormText
          name="createDept"
          label={intl.formatMessage({
            id: 'pages.carouseImage.createDept',
            defaultMessage: '创建部门',
          })}
          hidden={true}
          placeholder={intl.formatMessage({
            id: 'pages.carouseImage.createDeptPlaceholder',
            defaultMessage: '请输入创建部门',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'pages.carouseImage.createDeptRequired',
                defaultMessage: '请输入创建部门！',
              }),
            },
          ]}
        />


        <ProFormSelect
          name="type"
          label={intl.formatMessage({
            id: 'pages.carouseImage.imageType',
            defaultMessage: '图片类型',
          })}
          placeholder={intl.formatMessage({
            id: 'pages.carouseImage.imageTypePlaceholder',
            defaultMessage: '请选择图片类型',
          })}
          options={typeOptions}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.carouseImage.imageTypeRequired',
                defaultMessage: '请选择图片类型！',
              }),
            },
          ]}
        />
         <ProFormItem
          label={intl.formatMessage({
            id: 'pages.carouseImage.coverImage',
            defaultMessage: '封面图',
          })}
          name="image"
           rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'pages.carouseImage.coverImageRequired',
                defaultMessage: '请上传封面图！',
              }),
            },
          ]}
        >
          <FileUpload
            maxCount={1}
            accept="image/*"
            uploadText={intl.formatMessage({
              id: 'pages.carouseImage.uploadImage',
              defaultMessage: '上传图片',
            })}
            maxSize={5}
          />
        </ProFormItem>

        {
          <ProFormDependency name={['type']}>
            {({ type, name2 }) => {
              if (+type === 1) {
                return (
                  <>
                    <Col span={24}>
                      <ProFormItem
                        name="contentZh"
                        label={intl.formatMessage({
                          id: 'pages.carouseImage.contentZh',
                          defaultMessage: '内容(中)',
                        })}
                        required={true}
                        rules={[
                          {
                            required: false,
                            message: intl.formatMessage({
                              id: 'pages.carouseImage.contentZhRequired',
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
                          id: 'pages.carouseImage.contentEn',
                          defaultMessage: '内容(英)',
                        })}
                        required={true}
                        rules={[
                          {
                            required: false,
                            message: intl.formatMessage({
                              id: 'pages.carouseImage.contentEnRequired',
                              defaultMessage: '请输入内容(英)！',
                            }),
                          },
                        ]}
                      >
                        <Editor />
                      </ProFormItem>
                    </Col>
                  </>
                );
              }
              if (+type === 2) {
                return (
                  <>
                    <ProFormText
                      name="objectId"
                      label={intl.formatMessage({
                        id: 'pages.carouseImage.scienceArticle',
                        defaultMessage: '科普文章',
                      })}
                      placeholder={intl.formatMessage({
                        id: 'pages.carouseImage.scienceArticlePlaceholder',
                        defaultMessage: '请选择科普文章',
                      })}
                      readonly
                      addonAfter={
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => setScienceModalVisible(true)}
                        >
                          {intl.formatMessage({
                            id: 'pages.carouseImage.select',
                            defaultMessage: '选择',
                          })}
                        </Button>
                      }
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'pages.carouseImage.scienceArticleRequired',
                            defaultMessage: '请选择科普文章！',
                          }),
                        },
                      ]}
                    />
                    {selectedScience && (
                      <div style={{  marginBottom: 16,padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {selectedScience.coverImage && (
                            <Image
                              src={selectedScience.coverImage}
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{selectedScience.title}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>
                              {intl.formatMessage({
                                id: 'pages.carouseImage.category',
                                defaultMessage: '分类',
                              })}: {selectedScience.scienceCategory?.name || '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              }
              if (+type === 3) {
                return (
                  <>
                    <ProFormText
                      name="objectId"
                      label={intl.formatMessage({
                        id: 'pages.carouseImage.post',
                        defaultMessage: '动态',
                      })}
                      placeholder={intl.formatMessage({
                        id: 'pages.carouseImage.postPlaceholder',
                        defaultMessage: '请选择动态',
                      })}
                      readonly
                      addonAfter={
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => setPostModalVisible(true)}
                        >
                          {intl.formatMessage({
                            id: 'pages.carouseImage.select',
                            defaultMessage: '选择',
                          })}
                        </Button>
                      }
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'pages.carouseImage.postRequired',
                            defaultMessage: '请选择动态！',
                          }),
                        },
                      ]}
                    />
                    {selectedPost && (
                      <div style={{ marginBottom: 16, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {selectedPost.user?.avatar && (
                            <Image
                              src={selectedPost.user?.avatar}
                              width={40}
                              height={40}
                              style={{ objectFit: 'cover', borderRadius: '50%' }}
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{selectedPost.user?.nickName || intl.formatMessage({
                              id: 'pages.carouseImage.unknownUser',
                              defaultMessage: '未知用户',
                            })}</div>
                            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                              {selectedPost.content && selectedPost.content.length > 50
                                ? selectedPost.content.substring(0, 50) + '...'
                                : selectedPost.content}
                            </div>
                            <div style={{ fontSize: 12, color: '#999' }}>
                              {intl.formatMessage({
                                id: 'pages.carouseImage.category',
                                defaultMessage: '分类',
                              })}: {selectedPost.dynamicsPostCategory?.name || '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              }
            }}
          </ProFormDependency>
        }
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
        {/* 科普文章选择弹窗 */}
        <Modal
          title={intl.formatMessage({
            id: 'pages.carouseImage.selectScienceArticle',
            defaultMessage: '选择科普文章',
          })}
          open={scienceModalVisible}
          onCancel={() => setScienceModalVisible(false)}
          width={1000}
          footer={null}
        >
          <ProTable<ScienceListItem>
            actionRef={scienceActionRef}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            request={(params) =>
              listScience({ ...params }).then((res) => ({
                data: res.rows,
                total: res.total,
                success: true,
              }))
            }
            columns={[
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.coverImage',
                  defaultMessage: '封面图',
                }),
                dataIndex: 'coverImage',
                valueType: 'text',
                hideInSearch: true,
                width: 80,
                render: (_, record) => {
                  return record.coverImage ? (
                    <Image
                      src={record.coverImage}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    '-'
                  );
                },
              },
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.titleZh',
                  defaultMessage: '标题(中文)',
                }),
                dataIndex: 'titleZh',
                valueType: 'text',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.titleEn',
                  defaultMessage: '标题(英文)',
                }),
                dataIndex: 'titleEn',
                valueType: 'text',
              },
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.category',
                  defaultMessage: '分类',
                }),
                dataIndex: 'scienceCategoryId',
                valueType: 'text',
                hideInSearch: true,
                render: (_, record) => {
                  return record.scienceCategory?.name || '-';
                },
              },
              {
                title: intl.formatMessage({
                  id: 'pages.common.operation',
                  defaultMessage: '操作',
                }),
                valueType: 'option',
                width: 100,
                render: (_, record) => [
                  <Button
                    key="select"
                    type="primary"
                    size="small"
                    onClick={() => {
                      setSelectedScience(record);
                      form.setFieldValue('objectId', record.id);
                      setScienceModalVisible(false);
                    }}
                  >
                    {intl.formatMessage({
                      id: 'pages.carouseImage.select',
                      defaultMessage: '选择',
                    })}
                  </Button>,
                ],
              },
            ]}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Modal>

        {/* 动态选择弹窗 */}
        <Modal
          title={intl.formatMessage({
            id: 'pages.carouseImage.selectPost',
            defaultMessage: '选择动态',
          })}
          open={postModalVisible}
          onCancel={() => setPostModalVisible(false)}
          width={1200}
          footer={null}
        >
          <ProTable<PostListItem>
            actionRef={postActionRef}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            request={(params) =>
              listPost({ ...params }).then((res) => ({
                data: res.rows,
                total: res.total,
                success: true,
              }))
            }
            columns={[
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.userAvatar',
                  defaultMessage: '用户头像',
                }),
                dataIndex: 'avatar',
                valueType: 'text',
                hideInSearch: true,
                width: 80,
                render: (_, record) => {
                  return record.user?.avatar ? (
                    <Image
                      src={record.user?.avatar}
                      width={50}
                      height={50}
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    '-'
                  );
                },
              },
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.userName',
                  defaultMessage: '用户名',
                }),
                dataIndex: 'author',
                valueType: 'text',
                render: (_, record) => {
                  return record.user?.nickName || '-';
                },
              },
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.content',
                  defaultMessage: '内容',
                }),
                dataIndex: 'content',
                valueType: 'text',
                width: 300,
                render: (_, record) => {
                  if (record.content && record.content.length > 100) {
                    return record.content.substring(0, 100) + '...';
                  }
                  return record.content || '-';
                },
              },
              {
                title: '分类',
                dataIndex: 'dynamicsPostCategoryId',
                valueType: 'text',
                hideInSearch: true,
                render: (_, record) => {
                  return record.dynamicsPostCategory?.name || '-';
                },
              },
              {
                title: intl.formatMessage({
                  id: 'pages.carouseImage.isPublic',
                  defaultMessage: '是否公开',
                }),
                dataIndex: 'whetherPublic',
                valueType: 'text',
                hideInSearch: true,
                render: (_, record) => {
                  return +record.whetherPublic === 1
                    ? intl.formatMessage({
                        id: 'pages.common.yes',
                        defaultMessage: '是',
                      })
                    : intl.formatMessage({
                        id: 'pages.common.no',
                        defaultMessage: '否',
                      });
                },
              },
              {
                title: '操作',
                valueType: 'option',
                width: 100,
                render: (_, record) => [
                  <Button
                    key="select"
                    type="primary"
                    size="small"
                    onClick={() => {
                      setSelectedPost(record);
                      form.setFieldValue('objectId', record.id);
                      setPostModalVisible(false);
                    }}
                  >
                    选择
                  </Button>,
                ],
              },
            ]}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Modal>
    </Modal>

  );
};

export default ImageForm;
