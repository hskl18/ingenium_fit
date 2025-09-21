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
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined, CommentOutlined } from '@ant-design/icons';
import { listDoctor, delDoctor, addDoctor, updateDoctor } from '@/services/business/doctor';
import { listCenter } from '@/services/business/center';
import { listComment, delComment, addComment, updateComment } from '@/services/business/comment';
import { listReply, delReply } from '@/services/business/reply';
import UpdateForm from './edit';

export type DoctorListItem = {
  id?: number;
  createDept?: string;
  rehabilitationCenterId?: number;
  nameZh?: string;
  nameEn?: string;
  positionTitleZh?: string;
  positionTitleEn?: string;
  headImage?: string;
  avatar?: string;
  introductionZh?: string;
  introductionEn?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  rehabilitationCenter?: {
    nameZh?: string;
    nameEn?: string;
  };
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

type HealthCareCenter = {
  id: string;
  nameZh: string;
  nameEn: string;
};

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: DoctorListItem, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.adding',
    defaultMessage: '正在添加',
  }));
  try {
    const resp = await addDoctor({ ...fields });
    hide();
    if (resp.code === 200) {
      message.success(intl.formatMessage({
        id: 'pages.common.addSuccess',
        defaultMessage: '添加成功',
      }));
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error(intl.formatMessage({
      id: 'pages.common.addFailed',
      defaultMessage: '添加失败请重试！',
    }));
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: DoctorListItem, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.updating',
    defaultMessage: '正在更新',
  }));
  try {
    const resp = await updateDoctor(fields);
    hide();
    if (resp.code === 200) {
      message.success(intl.formatMessage({
        id: 'pages.common.updateSuccess',
        defaultMessage: '更新成功',
      }));
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error(intl.formatMessage({
      id: 'pages.common.updateFailed',
      defaultMessage: '配置失败请重试！',
    }));
    return false;
  }
};

/**
 * 删除节点
 */
const handleRemove = async (selectedRows: DoctorListItem[], intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.deleting',
    defaultMessage: '正在删除',
  }));
  if (!selectedRows) return true;
  try {
    const resp = await delDoctor(selectedRows.map((row) => row.id).join(','));
    hide();
    if (resp.code === 200) {
      message.success(intl.formatMessage({
        id: 'pages.common.deleteSuccess',
        defaultMessage: '删除成功，即将刷新',
      }));
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error(intl.formatMessage({
      id: 'pages.common.deleteFailed',
      defaultMessage: '删除失败，请重试',
    }));
    return false;
  }
};

const handleRemoveOne = async (selectedRow: DoctorListItem, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.deleting',
    defaultMessage: '正在删除',
  }));
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delDoctor(params.join(','));
    hide();
    if (resp.code === 200) {
      message.success(intl.formatMessage({
        id: 'pages.common.deleteSuccess',
        defaultMessage: '删除成功，即将刷新',
      }));
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error(intl.formatMessage({
      id: 'pages.common.deleteFailed',
      defaultMessage: '删除失败，请重试',
    }));
    return false;
  }
};

const DoctorTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [commentForm] = Form.useForm<any>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [replyModalVisible, setReplyModalVisible] = useState<boolean>(false);
  const [commentEditModalVisible, setCommentEditModalVisible] = useState<boolean>(false);
  const [currentDoctorId, setCurrentDoctorId] = useState<number>();
  const [currentCommentId, setCurrentCommentId] = useState<number>();
  const [currentComment, setCurrentComment] = useState<CommentListItem>();
  const actionRef = useRef<ActionType>();
  const commentActionRef = useRef<ActionType>();
  const replyActionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<DoctorListItem>();
  const [selectedRows, setSelectedRows] = useState<DoctorListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();
  const [centerOptions, setCenterOptions] = useState<HealthCareCenter[]>([]);

  const fetchCenterOptions = async () => {
    const res = await listCenter();
    if (res.code === 200) {
      setCenterOptions(
        res.rows.map((item: HealthCareCenter) => ({
          label: item.nameZh,
          value: item.id,
        })),
      );
    }
  };

  useEffect(() => {
    fetchCenterOptions();
  }, []);

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
        objectType: 4, // 医师类型
        objectId: currentDoctorId,
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

  const columns: ProColumns<DoctorListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.doctor.center',
        defaultMessage: '康复中心',
      }),
      dataIndex: 'rehabilitationCenterId',
      valueType: 'select',
      fieldProps: {
        options: centerOptions,
      },
      render: (_, record) => {
        return record.rehabilitationCenter?.nameZh || '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.doctor.nameZh',
        defaultMessage: '医师名称(中文)',
      }),
      dataIndex: 'nameZh',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.doctor.nameEn',
        defaultMessage: '医师名称(英文)',
      }),
      dataIndex: 'nameEn',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.doctor.avatar',
        defaultMessage: '头像',
      }),
      dataIndex: 'headImage',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.headImage ? (
          <Image
            src={record.headImage}
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
        id: 'pages.doctor.positionTitleZh',
        defaultMessage: '职称(中文)',
      }),
      dataIndex: 'positionTitleZh',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.doctor.positionTitleEn',
        defaultMessage: '职称(英文)',
      }),
      dataIndex: 'positionTitleEn',
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
          key="edit"
          hidden={!access.hasPerms('mgkf:doctor:edit')}
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
            setCurrentDoctorId(record.id);
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
          hidden={!access.hasPerms('mgkf:doctor:remove')}
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
        <ProTable<DoctorListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="doctorList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:doctor:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:doctor:remove')}
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
            listDoctor({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:doctor:remove')}
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
        onSubmit={async (values) => {
          let success = false;
          if (values.id) {
            success = await handleUpdate({ ...values } as DoctorListItem, intl);
          } else {
            success = await handleAdd({ ...values } as DoctorListItem, intl);
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

      {/* 医师评论列表弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: 'pages.doctor.commentList',
          defaultMessage: '医师评论列表',
        })}
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        width={1200}
        footer={null}
      >
        <ProTable<CommentListItem>
          actionRef={commentActionRef}
          rowKey="id"
          key={currentDoctorId}
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
              objectType: 4, // 医师类型
              objectId: currentDoctorId
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
                id: 'pages.common.images',
                defaultMessage: '图片',
              }),
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
              title: intl.formatMessage({
                id: 'pages.common.rating',
                defaultMessage: '星级',
              }),
              dataIndex: 'star',
              width: 120,
              render: (_, record) => {
                return <Rate disabled value={record.star || 0} />;
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
              width: 150,
              render: (_, record) => [
                <Button
                  key="delete"
                  type="link"
                  size="small"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: intl.formatMessage({
                        id: 'pages.doctor.deleteComment',
                        defaultMessage: '删除评论',
                      }),
                      content: intl.formatMessage({
                        id: 'pages.doctor.deleteCommentConfirm',
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
          id: 'pages.doctor.replyListTitle',
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
                id: 'pages.doctor.replyUser',
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
                id: 'pages.doctor.repliedUser',
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
                id: 'pages.doctor.replyContent',
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
                id: 'pages.doctor.replyTime',
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
                        id: 'pages.doctor.deleteReply',
                        defaultMessage: '删除回复',
                      }),
                      content: intl.formatMessage({
                        id: 'pages.doctor.deleteReplyConfirm',
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
          id: currentComment?.id ? 'pages.doctor.editComment' : 'pages.doctor.addComment',
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
            content:  '',
            images:  [],
            star: 5,
          }}
        >
          <ProFormText
            name="userNickname"
            label={intl.formatMessage({
              id: 'pages.doctor.commentUser',
              defaultMessage: '评论用户',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.doctor.commentUserRequired',
                  defaultMessage: '请输入评论用户名称',
                }),
              },
            ]}
          />
          <Col span={24}>
            <ProFormItem
              label={intl.formatMessage({
                id: 'pages.doctor.commentAvatar',
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
                  id: 'pages.doctor.uploadAvatar',
                  defaultMessage: '上传头像',
                })}
                maxSize={5}
              />
            </ProFormItem>
          </Col>
          <ProFormTextArea
            name="content"
            label={intl.formatMessage({
              id: 'pages.doctor.commentContent',
              defaultMessage: '评论内容',
            })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'pages.doctor.commentContentRequired',
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
                 id: 'pages.doctor.commentImages',
                 defaultMessage: '评论图片',
               })}
               name="images"
             >
               <FileUpload
                 maxCount={3}
                 accept="image/*"
                 uploadText={intl.formatMessage({
                   id: 'pages.doctor.uploadImages',
                   defaultMessage: '上传图片（最多3张）',
                 })}
                 maxSize={5}
               />
             </ProFormItem>
           </Col>
           <ProFormRate
             name="star"
             label={intl.formatMessage({
               id: 'pages.doctor.commentRating',
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

export default DoctorTableList;
