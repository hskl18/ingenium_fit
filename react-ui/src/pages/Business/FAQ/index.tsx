import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listFaqs, delFaqs, addFaqs, updateFaqs } from '@/services/business/faqs';
import UpdateForm from './edit';

export type FaqsListItem = {
  id?: number;
  createDept?: string;
  sort?: number;
  contentZh?: string;
  contentEn?: string;
  titleZh?: string;
  titleEn?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};


const FaqsTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<FaqsListItem>();
  const [selectedRows, setSelectedRows] = useState<FaqsListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();
  /**
   * 添加节点
   */
  const handleAdd = async (fields: FaqsListItem, ) => {
    const hide = message.loading(intl.formatMessage({
      id: 'pages.common.adding',
      defaultMessage: '正在添加',
    }));
    try {
      const resp = await addFaqs({ ...fields });
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
  const handleUpdate = async (fields: FaqsListItem, ) => {
    const hide = message.loading(intl.formatMessage({
      id: 'pages.common.updating',
      defaultMessage: '正在更新',
    }));
    try {
      const resp = await updateFaqs(fields);
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
  const handleRemove = async (selectedRows: FaqsListItem[], ) => {
    const hide = message.loading(intl.formatMessage({
      id: 'pages.common.deleting',
      defaultMessage: '正在删除',
    }));
    if (!selectedRows) return true;
    try {
      const resp = await delFaqs(selectedRows.map((row) => row.id).join(','));
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

  const handleRemoveOne = async (selectedRow: FaqsListItem, ) => {
    const hide = message.loading(intl.formatMessage({
      id: 'pages.common.deleting',
      defaultMessage: '正在删除',
    }));
    if (!selectedRow) return true;
    try {
      const params = [selectedRow.id];
      const resp = await delFaqs(params.join(','));
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
      message.error('删除失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<FaqsListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.faq.titleZh',
        defaultMessage: '问题(中文)',
      }),
      dataIndex: 'titleZh',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.faq.titleEn',
        defaultMessage: '问题(英文)',
      }),
      dataIndex: 'titleEn',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.faq.contentZh',
        defaultMessage: '答案(中文)',
      }),
      dataIndex: 'contentZh',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.faq.contentEn',
        defaultMessage: '答案(英文)',
      }),
      dataIndex: 'contentEn',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.faq.sort',
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
          hidden={!access.hasPerms('mgkf:faqs:edit')}
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
          hidden={!access.hasPerms('mgkf:faqs:remove')}
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
        <ProTable<FaqsListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="faqsList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:faqs:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:faqs:remove')}
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
            listFaqs({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:faqs:remove')}
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
            success = await handleUpdate({ ...values } as FaqsListItem);
          } else {
            success = await handleAdd({ ...values } as FaqsListItem);
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

export default FaqsTableList;
