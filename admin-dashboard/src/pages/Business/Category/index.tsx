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
import {
  listCategory,
  delCategory,
  addCategory,
  updateCategory,
} from '@/services/business/category';
import UpdateForm from './edit';

export type CategoryListItem = {
  id?: number;
  createDept?: string;
  nameZh?: string;
  nameEn?: string;
  sort?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};

const CategoryTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CategoryListItem>();
  const [selectedRows, setSelectedRows] = useState<CategoryListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();
  /**
   * 添加节点
   */
  const handleAdd = async (fields: CategoryListItem) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.adding',
        defaultMessage: '正在添加',
      }),
    );
    try {
      const resp = await addCategory({ ...fields });
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
   * 更新节点
   */
  const handleUpdate = async (fields: CategoryListItem) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.updating',
        defaultMessage: '正在更新',
      }),
    );
    try {
      const resp = await updateCategory(fields);
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.updateSuccess',
            defaultMessage: '更新成功',
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
          id: 'pages.common.updateFailed',
          defaultMessage: '配置失败请重试！',
        }),
      );
      return false;
    }
  };

  /**
   * {intl.formatMessage({
   id: 'pages.common.delete',
   defaultMessage: '删除',
   })}节点
   */
  const handleRemove = async (selectedRows: CategoryListItem[]) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.deleting',
        defaultMessage: '正在删除',
      }),
    );
    if (!selectedRows) return true;
    try {
      const resp = await delCategory(selectedRows.map((row) => row.id).join(','));
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

  const handleRemoveOne = async (selectedRow: CategoryListItem) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.deleting',
        defaultMessage: '正在删除',
      }),
    );
    if (!selectedRow) return true;
    try {
      const params = [selectedRow.id];
      const resp = await delCategory(params.join(','));
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

  const columns: ProColumns<CategoryListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.category.nameZh',
        defaultMessage: '分类名称(中)',
      }),
      dataIndex: 'nameZh',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.category.nameEn',
        defaultMessage: '分类名称(英)',
      }),
      dataIndex: 'nameEn',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.category.sort',
        defaultMessage: '排序',
      }),
      dataIndex: 'sort',
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
          hidden={!access.hasPerms('mgkf:category:edit')}
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
          hidden={!access.hasPerms('mgkf:category:remove')}
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
        <ProTable<CategoryListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="categoryList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:category:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:category:remove')}
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
            listCategory({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:category:remove')}
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
                  const success = await handleRemove(selectedRows,);
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
            success = await handleUpdate({ ...values } as CategoryListItem);
          } else {
            success = await handleAdd({ ...values } as CategoryListItem);
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

export default CategoryTableList;
