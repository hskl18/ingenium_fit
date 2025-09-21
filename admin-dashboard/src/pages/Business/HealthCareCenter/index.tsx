import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Image, Rate, Form, Upload, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileUpload from '@/components/FileUpload';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
  ProForm,
  ProFormItem,
  ProFormText,
  ProFormTextArea,
  ProFormRate,
} from '@ant-design/pro-components';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { listCenter, delCenter, addCenter, updateCenter } from '@/services/business/center';
import { listComment, delComment, addComment, updateComment } from '@/services/business/comment';
import { listReply, delReply } from '@/services/business/reply';
import UpdateForm from './edit';

export type CenterListItem = {
  id?: number;
  createDept?: string;
  coverImage?: string;
  backgroundImages?: string | string[];
  nameZh?: string;
  nameEn?: string;
  longitude?: string;
  latitude?: string;
  address?: string;
  detailZh?: string;
  detailEn?: string;
  star?: number;
  commentNum?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};

type CommentListItem = {
  id?: number;
  userId?: number;
  content?: string;
  images?: string;
  objectType?: number;
  objectId?: number;
  star?: number;
  createTime?: string;
  user?: {
    nickName?: string;
    avatar?: string;
  };
};

type ReplyListItem = {
  id?: number;
  userCommentId?: number;
  content?: string;
  userId?: number;
  replyUserId?: number;
  createTime?: string;
  user?: {
    nickName?: string;
    avatar?: string;
  };
  replyUser?: {
    nickName?: string;
    avatar?: string;
  };
};

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: CenterListItem) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addCenter({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success('添加成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: CenterListItem) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateCenter(fields);
    hide();
    if (resp.code === 200) {
      message.success('更新成功');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: CenterListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await delCenter(selectedRows.map((row) => row.id).join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleRemoveOne = async (selectedRow: CenterListItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delCenter(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success('删除成功，即将刷新');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const CenterTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [commentForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [replyModalVisible, setReplyModalVisible] = useState<boolean>(false);
  const [commentEditModalVisible, setCommentEditModalVisible] = useState<boolean>(false);
  const [currentCenterId, setCurrentCenterId] = useState<number>();
  const [currentCommentId, setCurrentCommentId] = useState<number>();
  const [currentComment, setCurrentComment] = useState<CommentListItem>();
  const actionRef = useRef<ActionType>();
  const commentActionRef = useRef<ActionType>();
  const replyActionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CenterListItem>();
  const [selectedRows, setSelectedRows] = useState<CenterListItem[]>([]);
  const access = useAccess();
  /** 国际化配置 */
  const intl = useIntl();

  /**
   * 删除评论
   */
  const handleRemoveComment = async (commentId: number) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.deleting',
        defaultMessage: '正在删除',
      }),
    );
    try {
      const resp = await delComment(commentId.toString());
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.deleteSuccess',
            defaultMessage: '删除成功',
          }),
        );
        commentActionRef.current?.reload();
      } else {
        message.error(resp.msg);
      }
      return true;
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'pages.common.deleteFailed',
          defaultMessage: '删除失败，请重试',
        }),
      );
      return false;
    }
  };

  /**
   * 删除回复
   */
  const handleRemoveReply = async (replyId: number) => {
    const hide = message.loading('正在删除');
    try {
      const resp = await delReply(replyId.toString());
      hide();
      if (resp.code === 200) {
        message.success('删除成功');
        replyActionRef.current?.reload();
      } else {
        message.error(resp.msg);
      }
      return true;
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'pages.common.deleteFailed',
          defaultMessage: '删除失败，请重试',
        }),
      );
      return false;
    }
  };

  /**
   * 添加或更新评论
   */
  const handleCommentSubmit = async (values: any) => {
    const hide = message.loading(currentComment?.id ? '正在更新' : '正在添加');
    try {
      const commentData = {
        ...values,
        objectType: 3, // 康复中心类型
        objectId: currentCenterId,
        id: currentComment?.id,
        user: {
          nickName: values.nickName,
          avatar: values.userAvatar || '',
        },
        content: values.content,
        images: values.images?.join?.(',') || '',
        star: values.star,
      };
      const resp = currentComment?.id
        ? await updateComment(commentData)
        : await addComment(commentData);
      hide();
      if (resp.code === 200) {
        message.success(currentComment?.id ? '更新成功' : '添加成功');
        setCommentEditModalVisible(false);
        setCurrentComment(undefined);
        commentForm.resetFields();
        commentActionRef.current?.reload();
      } else {
        message.error(resp.msg);
      }
      return true;
    } catch (error) {
      console.log(error);
      hide();
      message.error(currentComment?.id ? '更新失败请重试！' : '添加失败请重试！');
      return false;
    }
  };

  /**
   * 处理评论表单取消
   */
  const handleCommentCancel = () => {
    setCommentEditModalVisible(false);
    setCurrentComment(undefined);
    commentForm.resetFields();
  };

  const columns: ProColumns<CenterListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.nameZh',
        defaultMessage: '康复中心名称(中文)',
      }),
      dataIndex: 'nameZh',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.nameEn',
        defaultMessage: '康复中心名称(英文)',
      }),
      dataIndex: 'nameEn',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.coverImage',
        defaultMessage: '封面图片',
      }),
      dataIndex: 'coverImage',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.coverImage ? (
          <Image src={record.coverImage} width={50} height={50} style={{ objectFit: 'cover' }} />
        ) : (
          '-'
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.address',
        defaultMessage: '地址',
      }),
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.star',
        defaultMessage: '星级',
      }),
      dataIndex: 'star',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.commentNum',
        defaultMessage: '评论数',
      }),
      dataIndex: 'commentNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.address',
        defaultMessage: '地址',
      }),
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.detailZh',
        defaultMessage: '详情介绍(中文)',
      }),
      dataIndex: 'detailZh',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.healthCenter.detailEn',
        defaultMessage: '详情介绍(英文)',
      }),
      dataIndex: 'detailEn',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          size="small"
          key="edit"
          hidden={!access.hasPerms('mgkf:center:edit')}
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          {intl.formatMessage({
            id: 'pages.common.edit',
            defaultMessage: '编辑',
          })}
        </Button>,
        <Button
          type="link"
          size="small"
          key="comment"
          onClick={() => {
            setCurrentCenterId(record.id);
            setCommentModalVisible(true);
          }}
        >
          {intl.formatMessage({
            id: 'pages.common.comment',
            defaultMessage: '评论',
          })}
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('mgkf:center:remove')}
          onClick={async () => {
            Modal.confirm({
              title: intl.formatMessage({
                id: 'pages.common.delete',
                defaultMessage: '删除',
              }),
              content: intl.formatMessage({
                id: 'pages.common.deleteConfirm',
                defaultMessage: '确定删除该项吗？',
              }),
              okText: intl.formatMessage({
                id: 'pages.common.confirm',
                defaultMessage: '确认',
              }),
              cancelText: intl.formatMessage({
                id: 'pages.common.cancel',
                defaultMessage: '取消',
              }),
              onOk: async () => {
                const success = await handleRemoveOne(record, intl);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >
          {intl.formatMessage({
            id: 'pages.common.delete',
            defaultMessage: '删除',
          })}
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<CenterListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="centerList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:center:add')}
              onClick={async () => {
                setCurrentRow(undefined);
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
            </Button>,
            <Button
              type="primary"
              key="remove"
              danger
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:center:remove')}
              onClick={async () => {
                Modal.confirm({
                  title: '是否确认删除所选数据项?',
                  icon: <ExclamationCircleOutlined />,
                  content: '请谨慎操作',
                  async onOk() {
                    const success = await handleRemove(selectedRows);
                    if (success) {
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    }
                  },
                  onCancel() {},
                });
              }}
            >
              <DeleteOutlined />
              <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
            </Button>,
          ]}
          request={(params) =>
            listCenter({ ...params }).then((res) => {
              const result = {
                data: res.rows,
                total: res.total,
                success: true,
              };
              return result;
            })
          }
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
        />
      </div>
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />
              <a style={{ fontWeight: 600 }}>{selectedRows.length}</a>
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
            </div>
          }
        >
          <Button
            key="remove"
            danger
            hidden={!access.hasPerms('mgkf:center:remove')}
            onClick={async () => {
              Modal.confirm({
                title: '删除',
                content: '确定删除该项吗？',
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const success = await handleRemove(selectedRows);
                  if (success) {
                    setSelectedRows([]);
                    actionRef.current?.reloadAndRest?.();
                  }
                },
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={async (values) => {
          let success = false;
          if (values.id) {
            success = await handleUpdate({ ...values } as CenterListItem);
          } else {
            success = await handleAdd({ ...values } as CenterListItem);
          }
          if (success) {
            setModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(undefined);
        }}
        open={modalVisible}
        values={currentRow || {}}
      />

      {/* 康复中心评论列表弹窗 */}
      <Modal
        title="康复中心评论列表"
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        width={1200}
        footer={null}
      >
        <ProTable<CommentListItem>
          actionRef={commentActionRef}
          rowKey="id"
          key={currentCenterId}
          search={false}
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setCurrentComment(undefined);
                setCommentEditModalVisible(true);
                commentForm.resetFields();
              }}
            >
              {intl.formatMessage({
                id: 'pages.common.add',
                defaultMessage: '新增',
              })}
            </Button>,
          ]}
          request={(params) =>
            listComment({
              ...params,
              objectType: 3, // 康复中心类型
              objectId: currentCenterId,
            }).then((res) => ({
              data: res.rows,
              total: res.total,
              success: true,
            }))
          }
          columns={[
            {
              title: '用户',
              dataIndex: 'userId',
              width: 150,
              render: (_, record) => {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {record.user?.avatar && (
                      <Image
                        src={record.user?.avatar}
                        width={32}
                        height={32}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    )}
                    <span>{record.user?.nickName || '-'}</span>
                  </div>
                );
              },
            },
            {
              title: '评论内容',
              dataIndex: 'content',
              width: 400,
              render: (_, record) => {
                if (record.content && record.content.length > 100) {
                  return record.content.substring(0, 100) + '...';
                }
                return record.content || '-';
              },
            },
            {
              title: '图片',
              dataIndex: 'images',
              width: 150,
              render: (_, record) => {
                if (record.images) {
                  const imageUrls = record.images.split(',').filter(Boolean);
                  return (
                    <div style={{ display: 'flex', gap: 4 }}>
                      {imageUrls.slice(0, 3).map((url, index) => (
                        <Image
                          key={index}
                          src={url.trim()}
                          width={40}
                          height={40}
                          style={{ objectFit: 'cover' }}
                        />
                      ))}
                      {imageUrls.length > 3 && (
                        <span style={{ fontSize: 12, color: '#666' }}>+{imageUrls.length - 3}</span>
                      )}
                    </div>
                  );
                }
                return '-';
              },
            },
            {
              title: '星级',
              dataIndex: 'star',
              width: 120,
              render: (_, record) => {
                return <Rate disabled value={record.star || 0} />;
              },
            },
            {
              title: '评论时间',
              dataIndex: 'createTime',
              width: 150,
              valueType: 'dateTime',
            },
          ]}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Modal>

      {/* 回复列表弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: 'pages.healthCenter.replyListTitle',
          defaultMessage: '评论回复列表',
        })}
        open={replyModalVisible}
        key={currentCommentId}
        onCancel={() => setReplyModalVisible(false)}
        width={1000}
        footer={null}
      >
        <ProTable<ReplyListItem>
          actionRef={replyActionRef}
          rowKey="id"
          search={false}
          toolBarRender={false}
          request={(params) =>
            listReply({
              ...params,
              userCommentId: currentCommentId,
            }).then((res) => ({
              data: res.rows,
              total: res.total,
              success: true,
            }))
          }
          columns={[
            {
              title: intl.formatMessage({
                id: 'pages.healthCenter.replyUser',
                defaultMessage: '回复用户',
              }),
              dataIndex: 'userId',
              width: 150,
              render: (_, record) => {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {record.user?.avatar && (
                      <Image
                        src={record.user?.avatar}
                        width={32}
                        height={32}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    )}
                    <span>{record.user?.nickName || '-'}</span>
                  </div>
                );
              },
            },
            {
              title: intl.formatMessage({
                id: 'pages.healthCenter.repliedUser',
                defaultMessage: '被回复用户',
              }),
              dataIndex: 'replyUserId',
              width: 150,
              render: (_, record) => {
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {record.replyUser?.avatar && (
                      <Image
                        src={record.replyUser?.avatar}
                        width={32}
                        height={32}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    )}
                    <span>{record.replyUser?.nickName || '-'}</span>
                  </div>
                );
              },
            },
            {
              title: intl.formatMessage({
                id: 'pages.healthCenter.replyContent',
                defaultMessage: '回复内容',
              }),
              dataIndex: 'content',
              width: 300,
              render: (_, record) => {
                if (record.content && record.content.length > 100) {
                  return record.content.substring(0, 100) + '...';
                }
                return record.content || '-';
              },
            },
            {
              title: intl.formatMessage({
                id: 'pages.healthCenter.replyTime',
                defaultMessage: '回复时间',
              }),
              dataIndex: 'createTime',
              width: 150,
              valueType: 'dateTime',
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
                  key="delete"
                  type="link"
                  size="small"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: intl.formatMessage({
                        id: 'pages.healthCenter.deleteReply',
                        defaultMessage: '删除回复',
                      }),
                      content: intl.formatMessage({
                        id: 'pages.healthCenter.deleteReplyConfirm',
                        defaultMessage: '确定删除该回复吗？',
                      }),
                      okText: intl.formatMessage({
                        id: 'pages.common.confirm',
                        defaultMessage: '确认',
                      }),
                      cancelText: intl.formatMessage({
                        id: 'pages.common.cancel',
                        defaultMessage: '取消',
                      }),
                      onOk: () => handleRemoveReply(record.id!),
                    });
                  }}
                >
                  {intl.formatMessage({
                    id: 'pages.common.delete',
                    defaultMessage: '删除',
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

      {/* 评论编辑弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: currentComment?.id
            ? 'pages.healthCenter.editComment'
            : 'pages.healthCenter.addComment',
          defaultMessage: currentComment?.id ? '编辑评论' : '新增评论',
        })}
        open={commentEditModalVisible}
        onCancel={handleCommentCancel}
        footer={null}
        width={600}
      >
        <ProForm
          form={commentForm}
          onFinish={handleCommentSubmit}
          initialValues={{
            userNickname: '',
            userAvatar: '',
            content: '',
            images: [],
            star: 5,
          }}
        >
          <ProFormText
            name="userNickname"
            label={intl.formatMessage({
              id: 'pages.healthCenter.commentUser',
              defaultMessage: '评论用户',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.healthCenter.commentUserRequired',
                  defaultMessage: '请输入评论用户名称',
                }),
              },
            ]}
          />
          <Col span={24}>
            <ProFormItem
              label={intl.formatMessage({
                id: 'pages.healthCenter.commentAvatar',
                defaultMessage: '用户头像',
              })}
              name="userAvatar"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.healthCenter.commentAvatarRequired',
                    defaultMessage: '请上传用户头像',
                  }),
                },
              ]}
            >
              <FileUpload
                maxCount={1}
                accept="image/*"
                uploadText={intl.formatMessage({
                  id: 'pages.healthCenter.uploadAvatar',
                  defaultMessage: '上传头像',
                })}
                maxSize={5}
              />
            </ProFormItem>
          </Col>
          <ProFormTextArea
            name="content"
            label={intl.formatMessage({
              id: 'pages.healthCenter.commentContent',
              defaultMessage: '评论内容',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.healthCenter.commentContentRequired',
                  defaultMessage: '请输入评论内容',
                }),
              },
            ]}
            fieldProps={{
              rows: 4,
            }}
          />
          <Col span={24}>
            <ProFormItem
              label={intl.formatMessage({
                id: 'pages.healthCenter.commentImages',
                defaultMessage: '评论图片',
              })}
              name="images"
            >
              <FileUpload
                maxCount={3}
                accept="image/*"
                uploadText={intl.formatMessage({
                  id: 'pages.healthCenter.uploadImages',
                  defaultMessage: '上传图片（最多3张）',
                })}
                maxSize={5}
              />
            </ProFormItem>
          </Col>
          <ProFormRate
            name="star"
            label={intl.formatMessage({
              id: 'pages.healthCenter.commentRating',
              defaultMessage: '评分',
            })}
            fieldProps={{
              allowHalf: true,
            }}
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default CenterTableList;
