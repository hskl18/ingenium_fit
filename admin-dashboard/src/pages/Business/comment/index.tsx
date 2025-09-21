import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Image, Tag, Rate } from 'antd';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  listComment,
  delComment,
  addComment,
  updateComment,
} from '@/services/business/comment';
import UpdateForm from './edit';

export type CommentListItem = {
  id?: number;
  createDept?: string;
  userId?: number;
  content?: string;
  images?: string;
  objectType?: number;
  objectId?: number;
  star?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  user?: {
    nickName?: string;
    avatar?: string;
  };
};

/**
 * 添加节点
 */
const handleAdd = async (fields: CommentListItem) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addComment({ ...fields });
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
const handleUpdate = async (fields: CommentListItem) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateComment(fields);
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
const handleRemove = async (selectedRows: CommentListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await delComment(selectedRows.map((row) => row.id).join(','));
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

const handleRemoveOne = async (selectedRow: CommentListItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delComment(params.join(','));
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

const CommentTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CommentListItem>();
  const [selectedRows, setSelectedRows] = useState<CommentListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();

  const objectTypeOptions = [
    { label: '动态帖子', value: 1 },
    { label: '科普', value: 2 },
    { label: '康复中心', value: 3 },
    { label: '医师', value: 4 },
  ];

  const getObjectTypeName = (type: number) => {
    const option = objectTypeOptions.find(item => item.value === type);
    return option ? option.label : '-';
  };

  const columns: ProColumns<CommentListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.comment.user',
        defaultMessage: '用户',
      }),
      dataIndex: 'userId',
      valueType: 'text',
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
        id: 'pages.comment.content',
        defaultMessage: '内容',
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
        id: 'pages.comment.images',
        defaultMessage: '图片',
      }),
      dataIndex: 'images',
      valueType: 'text',
      hideInSearch: true,
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
        id: 'pages.comment.objectType',
        defaultMessage: '评论对象类型',
      }),
      dataIndex: 'objectType',
      valueType: 'select',
      fieldProps: {
        options: objectTypeOptions,
      },
      render: (_, record) => {
        return getObjectTypeName(record.objectType || 0);
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.comment.objectId',
        defaultMessage: '评论对象ID',
      }),
      dataIndex: 'objectId',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.comment.star',
        defaultMessage: '星级',
      }),
      dataIndex: 'star',
      valueType: 'digit',
      hideInSearch: true,
      render: (_, record) => {
        return <Rate disabled value={record.star || 0} />;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.comment.createTime',
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
          hidden={!access.hasPerms('mgkf:comment:edit')}
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
          danger
          key="batchRemove"
          hidden={!access.hasPerms('mgkf:comment:remove')}
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
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<CommentListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="commentList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:comment:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:comment:remove')}
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
            listComment({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:comment:remove')}
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
            success = await handleUpdate({ ...values } as CommentListItem);
          } else {
            success = await handleAdd({ ...values } as CommentListItem);
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

export default CommentTableList;