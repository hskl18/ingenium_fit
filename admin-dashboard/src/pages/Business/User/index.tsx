import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal, Image } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listUser, delUser, addUser, updateUser } from '@/services/business/user';
import UpdateForm from './edit';

export type UserListItem = {
  id?: number;
  createDept?: string;
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  status?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};

/**
 * 添加节点
 */
const handleAdd = async (fields: UserListItem, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.adding',
    defaultMessage: '正在添加',
  }));
  try {
    const resp = await addUser({ ...fields });
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
 */
const handleUpdate = async (fields: UserListItem, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.updating',
    defaultMessage: '正在更新',
  }));
  try {
    const resp = await updateUser(fields);
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
const handleRemove = async (selectedRows: UserListItem[], intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.deleting',
    defaultMessage: '正在删除',
  }));
  if (!selectedRows) return true;
  try {
    const resp = await delUser(selectedRows.map((row) => row.id).join(','));
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

const handleRemoveOne = async (selectedRow: UserListItem, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.deleting',
    defaultMessage: '正在删除',
  }));
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delUser(params.join(','));
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

const UserTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const [selectedRows, setSelectedRows] = useState<UserListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();

  const columns: ProColumns<UserListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.user.firstName',
        defaultMessage: '名称',
      }),
      dataIndex: 'firstName',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.user.lastName',
        defaultMessage: '姓氏',
      }),
      dataIndex: 'lastName',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.user.nickName',
        defaultMessage: '昵称',
      }),
      dataIndex: 'nickName',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.user.email',
        defaultMessage: '邮箱',
      }),
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.user.phone',
        defaultMessage: '手机号',
      }),
      dataIndex: 'phone',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.user.avatar',
        defaultMessage: '头像',
      }),
      dataIndex: 'avatar',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.avatar ? (
          <Image
            src={record.avatar}
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      width: '220px',
      valueType: 'option',
      render: (_, record) => [
        // <Button
        //   type="link"
        //   size="small"
        //   key="edit"
        //   hidden={!access.hasPerms('mgkf:user:edit')}
        //   onClick={() => {
        //     setModalVisible(true);
        //     setCurrentRow(record);
        //   }}
        // >
        //   编辑
        // </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('mgkf:user:remove')}
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
        <ProTable<UserListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="userList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            // <Button
            //   type="primary"
            //   key="add"
            //   hidden={!access.hasPerms('mgkf:user:add')}
            //   onClick={async () => {
            //     setCurrentRow(undefined);
            //     setModalVisible(true);
            //   }}
            // >
            //   <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
            // </Button>,
            <Button
              type="primary"
              key="remove"
              danger
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:user:remove')}
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
            listUser({ ...params }).then((res) => {
              const result = {
                data: res.rows,
                total: res.total,
                success: true,
              };
              return result;
            })
          }
          columns={columns}
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
            hidden={!access.hasPerms('mgkf:user:remove')}
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
            success = await handleUpdate({ ...values } as UserListItem);
          } else {
            success = await handleAdd({ ...values } as UserListItem);
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

export default UserTableList;
