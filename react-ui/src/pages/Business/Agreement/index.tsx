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
  listAgreement,
  delAgreement,
  addAgreement,
  updateAgreement,
} from '@/services/business/agreement';
import UpdateForm from './edit';

export type AgreementListItem = {
  id?: number;
  createDept?: string;
  titleZh?: string;
  titleEn?: string;
  contentZh?: string;
  contentEn?: string;
  code?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: AgreementListItem, intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.adding',
      defaultMessage: '正在添加',
    }),
  );
  try {
    const resp = await addAgreement({ ...fields });
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
 *
 * @param fields
 */
const handleUpdate = async (fields: AgreementListItem, intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.updating',
      defaultMessage: '正在更新',
    }),
  );
  console.log('fields', fields);
  try {
    const resp = await updateAgreement(fields);
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
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: AgreementListItem[], intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.deleting',
      defaultMessage: '正在删除',
    }),
  );
  if (!selectedRows) return true;
  try {
    const resp = await delAgreement(selectedRows.map((row) => row.id).join(','));
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

const handleRemoveOne = async (selectedRow: AgreementListItem, intl: any) => {
  const hide = message.loading(
    intl.formatMessage({
      id: 'pages.common.deleting',
      defaultMessage: '正在删除',
    }),
  );
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.id];
    const resp = await delAgreement(params.join(','));
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

const AgreementTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<AgreementListItem>();
  const [selectedRows, setSelectedRows] = useState<AgreementListItem[]>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  const columns: ProColumns<AgreementListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.agreement.titleZh',
        defaultMessage: '标题(中)',
      }),
      dataIndex: 'titleZh',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.agreement.titleEn',
        defaultMessage: '标题(英)',
      }),
      dataIndex: 'titleEn',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.agreement.code',
        defaultMessage: '协议编码',
      }),
      dataIndex: 'code',
      valueType: 'text',
    },
    {
      title: intl.formatMessage({
        id: 'pages.agreement.contentZh',
        defaultMessage: '内容(中)',
      }),
      dataIndex: 'contentZh',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.agreement.contentEn',
        defaultMessage: '内容(英)',
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
          hidden={!access.hasPerms('mgkf:agreement:edit')}
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
        // <Button
        //   type="link"
        //   size="small"
        //   danger
        //   key="batchRemove"
        //   hidden={!access.hasPerms('mgkf:agreement:remove')}
        //   onClick={async () => {
        //     Modal.confirm({
        //       title: intl.formatMessage({
        //         id: 'pages.common.delete',
        //         defaultMessage: '删除',
        //       }),
        //       content: intl.formatMessage({
        //         id: 'pages.common.deleteConfirm',
        //         defaultMessage: '确定删除该项吗？',
        //       }),
        //       okText: intl.formatMessage({
        //         id: 'pages.common.confirm',
        //         defaultMessage: '确认',
        //       }),
        //       cancelText: intl.formatMessage({
        //         id: 'pages.common.cancel',
        //         defaultMessage: '取消',
        //       }),
        //       onOk: async () => {
        //         const success = await handleRemoveOne(record, intl);
        //         if (success) {
        //           if (actionRef.current) {
        //             actionRef.current.reload();
        //           }
        //         }
        //       },
        //     });
        //   }}
        // >
        //   {intl.formatMessage({
        //     id: 'pages.common.delete',
        //     defaultMessage: '删除',
        //   })}
        // </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <div style={{ width: '100%', float: 'right' }}>
        <ProTable<AgreementListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="agreementList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:agreement:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:agreement:remove')}
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
            listAgreement({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:agreement:remove')}
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
            success = await handleUpdate({ ...values } as AgreementListItem, intl);
          } else {
            success = await handleAdd({ ...values } as AgreementListItem, intl);
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

export default AgreementTableList;
