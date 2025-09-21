import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Image } from 'antd';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  listReply,
  delReply,
  addReply,
  updateReply,
} from '@/services/business/reply';
import UpdateForm from './edit';

export type ReplyListItem = {
  id?: number;
  createDept?: string;
  userCommentId?: number;
  content?: string;
  userId?: number;
  replyUserId?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
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
const handleAdd = async (fields: ReplyListItem) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addReply({ ...fields });
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
 */
const handleUpdate = async (fields: ReplyListItem) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateReply(fields);
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
 */
const handleRemove = async (selectedRows: ReplyListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await delReply(selectedRows.map((row) => row.id).join(','));
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

const handleRemoveOne = async (selectedRow: ReplyListItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delReply(params.join(','));
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

const ReplyTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ReplyListItem>();
  const [selectedRows, setSelectedRows] = useState<ReplyListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();

  const columns: ProColumns<ReplyListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.reply.commentId',
        defaultMessage: '评论ID',
      }),
      dataIndex: 'userCommentId',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.reply.replyUser',
        defaultMessage: '回复用户',
      }),
      dataIndex: 'userId',
      valueType: 'text',
      hideInSearch: true,
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
        id: 'pages.reply.repliedUser',
        defaultMessage: '被回复用户',
      }),
      dataIndex: 'replyUserId',
      valueType: 'text',
      hideInSearch: true,
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
        id: 'pages.reply.content',
        defaultMessage: '回复内容',
      }),
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch: true,
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
        id: 'pages.reply.createTime',
        defaultMessage: '创建时间',
      }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
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
          hidden={!access.hasPerms('mgkf:reply:edit')}
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('mgkf:reply:remove')}
          onClick={async () => {
            Modal.confirm({
              title: '删除',
              content: '确定删除该项吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: async () => {
                const success = await handleRemoveOne(record);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              },
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<ReplyListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="replyList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:reply:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:reply:remove')}
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
            listReply({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:reply:remove')}
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
            success = await handleUpdate({ ...values } as ReplyListItem);
          } else {
            success = await handleAdd({ ...values } as ReplyListItem);
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
    </PageContainer>
  );
};

export default ReplyTableList;