import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Tag, Image, Rate, Form, Upload, Col } from 'antd';
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
  ProFormUploadButton,
} from '@ant-design/pro-components';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { listPost, delPost, addPost, updatePost } from '@/services/business/post';
import UpdateForm from './edit';
import PostDetail from './detail';
import { listCategory } from '@/services/business/category';
import { listComment, delComment, addComment, updateComment } from '@/services/business/comment';
import { listReply, delReply } from '@/services/business/reply';

export type PostListItem = {
  id?: number;
  createDept?: string;
  categoryId?: number;
  title?: string;
  content?: string;
  author?: string;
  status?: string;
  viewCount?: number;
  likeCount?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  dynamicsPostCategory?: {
    name?: string;
  };
  user?: {
    nickName?: string;
    avatar?: string;
  };
  whetherPublic?: string;
  whetherRecommend?: string;
  forwardNum?: number;
  commentNum?: number;
  likesNum?: number;
};

type ScienceCategory = {
  id: string;
  nameZh: string;
  name: string;
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
 */
const handleAdd = async (fields: PostListItem, intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.adding',
      defaultMessage: '正在添加',
    }),
  );
  try {
    const resp = await addPost({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.common.addSuccess',
          defaultMessage: '添加成功',
        }),
      );
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error(
      intl.formatMessage({
        id: 'pages.common.addFailed',
        defaultMessage: '添加失败请重试！',
      }),
    );
    return false;
  }
};

/**
 * 删除节点
 */
const handleRemove = async (selectedRows: PostListItem[], intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.deleting',
      defaultMessage: '正在删除',
    }),
  );
  if (!selectedRows) return true;
  try {
    const resp = await delPost(selectedRows.map((row) => row.id).join(','));
    hide();
    if (resp.code === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.common.deleteSuccess',
          defaultMessage: '删除成功，即将刷新',
        }),
      );
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

const handleRemoveOne = async (selectedRow: PostListItem, intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.deleting',
      defaultMessage: '正在删除',
    }),
  );
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delPost(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success(
        intl.formatMessage({
          id: 'pages.common.deleteSuccess',
          defaultMessage: '删除成功，即将刷新',
        }),
      );
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

const PostTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [commentForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [replyModalVisible, setReplyModalVisible] = useState<boolean>(false);
  const [commentEditModalVisible, setCommentEditModalVisible] = useState<boolean>(false);
  const [currentPostId, setCurrentPostId] = useState<number>();
  const [currentCommentId, setCurrentCommentId] = useState<number>();
  const [currentComment, setCurrentComment] = useState<CommentListItem>();
  const actionRef = useRef<ActionType>();
  const commentActionRef = useRef<ActionType>();
  const replyActionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<PostListItem>();
  const [selectedRows, setSelectedRows] = useState<PostListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([]);

  const fetchCategoryOptions = async () => {
    const res = await listCategory();
    if (res.code === 200) {
      setCategoryOptions(
        res.rows.map((item: ScienceCategory) => ({
          label: item.name,
          value: item.id,
        })),
      );
    }
  };

  useEffect(() => {
    fetchCategoryOptions();
  }, []);

  /**
   * 更新节点
   */
  const handleUpdate = async (fields: PostListItem) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.updating',
        defaultMessage: '正在更新',
      }),
    );
    try {
      const resp = await updatePost(fields);
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.updateSuccess',
            defaultMessage: '更新成功',
          }),
        );
        actionRef.current?.reload();
      } else {
        message.error(resp.msg);
      }
      return true;
    } catch (error) {
      hide();
      message.error(
        intl.formatMessage({
          id: 'pages.common.updateFailed',
          defaultMessage: '配置失败请重试！',
        }),
      );
      return false;
    }
  };

  /**
   * 删除评论
   */
  const handleRemoveComment = async (commentId: number) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.deleting',
        defaultMessage: '正在删除',
      })
    );
    try {
      const resp = await delComment(commentId.toString());
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.deleteSuccess',
            defaultMessage: '删除成功',
          })
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
        })
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
        })
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
        objectType: 1, // 动态类型
        objectId: currentPostId,
        id: currentComment?.id,
        user: {
          nickName: values.nickName,
          avatar: values.userAvatar || '',
        },
        content: values.content,
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

  const columns: ProColumns<PostListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.post.category',
        defaultMessage: '分类',
      }),
      dataIndex: 'dynamicsPostCategoryId',
      valueType: 'select',
      fieldProps: {
        options: categoryOptions,
      },
      render: (_, record) => {
        return record.dynamicsPostCategory?.name;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.user',
        defaultMessage: '用户',
      }),
      dataIndex: 'author',
      valueType: 'text',
      render: (_, record) => {
        return record.user?.nickName || '-';
      },
    },

    {
      title: intl.formatMessage({
        id: 'pages.post.avatar',
        defaultMessage: '头像',
      }),
      dataIndex: 'avatar',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.user?.avatar ? (
          <Image src={record.user?.avatar} width={50} height={50} style={{ objectFit: 'cover' }} />
        ) : (
          '-'
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.content',
        defaultMessage: '内容',
      }),
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch: true,
      width: 240,
      render: (_, record) => {
        if (record.content && record.content.length > 100) {
          return record.content.substring(0, 100) + '...';
        }
        return record.content || '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.whetherPublic',
        defaultMessage: '是否公开',
      }),
      dataIndex: 'whetherPublic',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        // 是否公开：1-是 2-否
        return +(record.whetherPublic || 0) === 1 ? (
          <Tag color="green">
            {intl.formatMessage({
              id: 'pages.common.yes',
              defaultMessage: '是',
            })}
          </Tag>
        ) : (
          <Tag color="red">
            {intl.formatMessage({
              id: 'pages.common.no',
              defaultMessage: '否',
            })}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.whetherRecommend',
        defaultMessage: '是否推荐',
      }),
      dataIndex: 'whetherRecommend',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: intl.formatMessage({
              id: 'pages.common.yes',
              defaultMessage: '是',
            }),
            value: '1',
          },
          {
            label: intl.formatMessage({
              id: 'pages.common.no',
              defaultMessage: '否',
            }),
            value: '2',
          },
        ],
      },
      render: (_, record) => {
        // 是否推荐：1-是 2-否
        return +(record.whetherRecommend || 0) === 1 ? (
          <Tag color="green">
            {intl.formatMessage({
              id: 'pages.common.yes',
              defaultMessage: '是',
            })}
          </Tag>
        ) : (
          <Tag color="red">
            {intl.formatMessage({
              id: 'pages.common.no',
              defaultMessage: '否',
            })}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.forwardNum',
        defaultMessage: '转发数',
      }),
      dataIndex: 'forwardNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.commentNum',
        defaultMessage: '评论数',
      }),
      dataIndex: 'commentNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.post.likesNum',
        defaultMessage: '点赞数',
      }),
      dataIndex: 'likesNum',
      valueType: 'text',
      hideInSearch: true,
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
          key="view"
          hidden={!access.hasPerms('mgkf:post:detail')}
          onClick={() => {
            setDetailVisible(true);
            setCurrentRow(record);
          }}
        >
          {intl.formatMessage({
            id: 'pages.common.detail',
            defaultMessage: '详情',
          })}
        </Button>,
        <Button
          type="link"
          size="small"
          key="whetherRecommend"
          hidden={!access.hasPerms('mgkf:science:edit')}
          onClick={() => {
            handleUpdate({
              ...record,
              whetherRecommend: +(record.whetherRecommend || 0) === 1 ? '2' : '1',
            });
          }}
        >
          {+(record.whetherRecommend || 0) === 1
            ? intl.formatMessage({
                id: 'pages.post.cancelRecommend',
                defaultMessage: '取消推荐',
              })
            : intl.formatMessage({
                id: 'pages.post.setRecommend',
                defaultMessage: '设置推荐',
              })}
        </Button>,
        +record.sourceType === 1 ? (
          <Button
            type="link"
            size="small"
            key="edit"
            hidden={!access.hasPerms('mgkf:post:edit')}
            onClick={() => {
              setModalVisible(true);
              setCurrentRow(record);
            }}
          >
            {intl.formatMessage({
              id: 'pages.common.edit',
              defaultMessage: '编辑',
            })}
          </Button>
        ) : null,
        <Button
          type="link"
          size="small"
          key="comment"
          onClick={() => {
            setCurrentPostId(record.id);
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
          hidden={!access.hasPerms('mgkf:post:remove')}
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
        <ProTable<PostListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="postList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:post:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:post:remove')}
              onClick={async () => {
                Modal.confirm({
                  title: intl.formatMessage({
                    id: 'pages.common.batchDeleteConfirm',
                    defaultMessage: '是否确认删除所选数据项?',
                  }),
                  icon: <ExclamationCircleOutlined />,
                  content: intl.formatMessage({
                    id: 'pages.common.operateCarefully',
                    defaultMessage: '请谨慎操作',
                  }),
                  async onOk() {
                    const success = await handleRemove(selectedRows, intl);
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
            listPost({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:post:remove')}
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
                  const success = await handleRemove(selectedRows, intl);
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
        categoryOptions={categoryOptions}
        onSubmit={async (values) => {
          let success = false;
          if (values.id) {
            success = await handleUpdate({ ...values } as PostListItem);
          } else {
            success = await handleAdd({ ...values } as PostListItem, intl);
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
      <PostDetail
        open={detailVisible}
        onCancel={() => {
          setDetailVisible(false);
          setCurrentRow(undefined);
        }}
        values={currentRow || {}}
      />

      {/* 动态评论列表弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: 'pages.post.commentListTitle',
          defaultMessage: '动态评论列表',
        })}
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        width={1200}
        footer={null}
      >
        <ProTable<CommentListItem>
          actionRef={commentActionRef}
          rowKey="id"
          key={currentPostId}
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
              objectType: 1, // 动态帖子类型 1-动态帖子 2-科普 3-康复中心 4-医师
              objectId: currentPostId,
            }).then((res) => ({
              data: res.rows,
              total: res.total,
              success: true,
            }))
          }
          columns={[
            {
              title: intl.formatMessage({
                id: 'pages.common.user',
                defaultMessage: '用户',
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
                id: 'pages.common.commentContent',
                defaultMessage: '评论内容',
              }),
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
              title: intl.formatMessage({
                id: 'pages.common.commentTime',
                defaultMessage: '评论时间',
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
                  key="reply"
                  type="link"
                  size="small"
                  onClick={() => {
                    setCurrentCommentId(record.id);
                    setReplyModalVisible(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'pages.common.reply',
                    defaultMessage: '回复',
                  })}
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  size="small"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: intl.formatMessage({
                        id: 'pages.post.deleteComment',
                        defaultMessage: '删除评论',
                      }),
                      content: intl.formatMessage({
                        id: 'pages.post.deleteCommentConfirm',
                        defaultMessage: '确定删除该评论吗？',
                      }),
                      okText: intl.formatMessage({
                        id: 'pages.common.confirm',
                        defaultMessage: '确认',
                      }),
                      cancelText: intl.formatMessage({
                        id: 'pages.common.cancel',
                        defaultMessage: '取消',
                      }),
                      onOk: () => handleRemoveComment(record.id!),
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

      {/* 回复列表弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: 'pages.post.replyListTitle',
          defaultMessage: '评论回复列表',
        })}
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        width={1000}
        footer={null}
      >
        <ProTable<ReplyListItem>
          actionRef={replyActionRef}
          rowKey="id"
          key={currentCommentId}
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
                id: 'pages.post.replyUser',
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
                id: 'pages.post.repliedUser',
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
                id: 'pages.post.replyContent',
                defaultMessage: '回复内容',
              }),
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
              title: intl.formatMessage({
                id: 'pages.post.replyTime',
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
                        id: 'pages.post.deleteReply',
                        defaultMessage: '删除回复',
                      }),
                      content: intl.formatMessage({
                        id: 'pages.post.deleteReplyConfirm',
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
          id: currentComment?.id ? 'pages.post.editComment' : 'pages.post.addComment',
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
              userNickname:  '',
              userAvatar: '',
              content: '',
            }}
        >
          <ProFormText
            name="userNickname"
            label={intl.formatMessage({
              id: 'pages.post.commentUser',
              defaultMessage: '评论用户',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.post.commentUserRequired',
                  defaultMessage: '请输入评论用户名称',
                }),
              },
            ]}
          />
          <Col span={24}>
             <ProFormItem
               label={intl.formatMessage({
                 id: 'pages.post.commentAvatar',
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
          <ProFormTextArea
            name="content"
            label={intl.formatMessage({
              id: 'pages.post.commentContent',
              defaultMessage: '评论内容',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.post.commentContentRequired',
                  defaultMessage: '请输入评论内容',
                }),
              },
            ]}
            fieldProps={{
              rows: 4,
            }}
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default PostTableList;
