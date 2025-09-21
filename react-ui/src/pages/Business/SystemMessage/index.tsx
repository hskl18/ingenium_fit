import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listMessage, delMessage, addMessage, updateMessage } from '@/services/business/message';
import UpdateForm from './edit';

export type SystemMessageListItem = {
  id?: number;
  createDept?: string;
  titleZh?: string;
  titleEn?: string;
  sketchZh?: string;
  sketchEn?: string;
  contentZh?: string;
  contentEn?: string;
  isPublish?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};

/**
 * 添加节点
 */
const handleAdd = async (fields: SystemMessageListItem) => {
  const hide = message.loading('正在添加');
  try {
    const resp = await addMessage({ ...fields });
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
const handleUpdate = async (fields: SystemMessageListItem) => {
  const hide = message.loading('正在更新');
  try {
    const resp = await updateMessage(fields);
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
const handleRemove = async (selectedRows: SystemMessageListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const resp = await delMessage(selectedRows.map((row) => row.id).join(','));
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

const handleRemoveOne = async (selectedRow: SystemMessageListItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delMessage(params.join(','));
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

const SystemMessageTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<SystemMessageListItem>();
  const [selectedRows, setSelectedRows] = useState<SystemMessageListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();

  const columns: ProColumns<SystemMessageListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.systemMessage.titleZh',
        defaultMessage: '标题(中文)',
      }),
      dataIndex: 'titleZh',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.systemMessage.titleEn',
        defaultMessage: '标题(英文)',
      }),
      dataIndex: 'titleEn',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.systemMessage.sketchZh',
        defaultMessage: '摘要(中文)',
      }),
      dataIndex: 'sketchZh',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.systemMessage.sketchEn',
        defaultMessage: '摘要(英文)',
      }),
      dataIndex: 'sketchEn',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.systemMessage.contentZh',
        defaultMessage: '内容(中文)',
      }),
      dataIndex: 'contentZh',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.systemMessage.contentEn',
        defaultMessage: '内容(英文)',
      }),
      dataIndex: 'contentEn',
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
          hidden={!access.hasPerms('mgkf:message:edit')}
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
          hidden={!access.hasPerms('mgkf:message:remove')}
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
        <ProTable<SystemMessageListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="systemMessageList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:message:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:message:remove')}
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
            listMessage({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:message:remove')}
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
            success = await handleUpdate({ ...values } as SystemMessageListItem);
          } else {
            success = await handleAdd({ ...values } as SystemMessageListItem);
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

export default SystemMessageTableList;
