
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage, useAccess, history } from '@umijs/max';
import type { FormInstance } from 'antd';
import { Button, message, Modal } from 'antd';
import { ActionType, FooterToolbar, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getDictTypeList, removeDictType, addDictType, updateDictType, exportDictType } from '@/services/system/dict';
import UpdateForm from './edit';
import { getDictValueEnum } from '@/services/system/dict';
import DictTag from '@/components/DictTag';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.System.DictType, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.adding',
    defaultMessage: '正在添加',
  }));
  try {
    const resp = await addDictType({ ...fields });
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
const handleUpdate = async (fields: API.System.DictType, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.updating',
    defaultMessage: '正在更新',
  }));
  try {
    const resp = await updateDictType(fields);
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
      defaultMessage: '更新失败请重试！',
    }));
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.System.DictType[], intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.deleting',
    defaultMessage: '正在删除',
  }));
  if (!selectedRows) return true;
  try {
    const resp = await removeDictType(selectedRows.map((row) => row.dictId).join(','));
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

const handleRemoveOne = async (selectedRow: API.System.DictType, intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.deleting',
    defaultMessage: '正在删除',
  }));
  if (!selectedRow) return true;
  try {
    const params = [selectedRow.dictId];
    const resp = await removeDictType(params.join(','));
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

/**
 * 导出数据
 *
 *
 */
const handleExport = async (intl: any) => {
  const hide = message.loading(intl.formatMessage({
    id: 'pages.common.exporting',
    defaultMessage: '正在导出',
  }));
  try {
    await exportDictType();
    hide();
    message.success(intl.formatMessage({
      id: 'pages.common.exportSuccess',
      defaultMessage: '导出成功',
    }));
    return true;
  } catch (error) {
    hide();
    message.error(intl.formatMessage({
      id: 'pages.common.exportFailed',
      defaultMessage: '导出失败，请重试',
    }));
    return false;
  }
};


const DictTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.System.DictType>();
  const [selectedRows, setSelectedRows] = useState<API.System.DictType[]>([]);

  const [statusOptions, setStatusOptions] = useState<any>([]);

  const access = useAccess();

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getDictValueEnum('sys_normal_disable').then((data) => {
      setStatusOptions(data);
    });
  }, []);

  const columns: ProColumns<API.System.DictType>[] = [
    {
      title: <FormattedMessage id="system.dict.dict_id" defaultMessage="字典编号" />,
      dataIndex: 'dictId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.dict.dict_name" defaultMessage="字典名称" />,
      dataIndex: 'dictName',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="system.dict.dict_type" defaultMessage="字典类型" />,
      dataIndex: 'dictType',
      valueType: 'text',
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              history.push(`/system/dict-data/index/${record.dictId}`);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="system.dict.status" defaultMessage="状态" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      render: (_, record) => {
        return (<DictTag enums={statusOptions} value={record.status} />);
      },
    },
    {
      title: <FormattedMessage id="system.dict.remark" defaultMessage="备注" />,
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="system.role.create_time" defaultMessage="创建时间" />,
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, record) => {
        return (<span>{record.createTime?.toString()} </span>);
      },
      search: {
        transform: (value) => {
          return {
            'params[beginTime]': value[0],
            'params[endTime]': value[1],
          };
        },
      },
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
          hidden={!access.hasPerms('system:dictType:edit')}
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
          }}
        >
          {intl.formatMessage({
            id: 'system.menu.edit',
            defaultMessage: '编辑',
          })}
        </Button>,
        <Button
          type="link"
          size="small"
          danger
          key="batchRemove"
          hidden={!access.hasPerms('system:dictType:remove')}
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
        <ProTable<API.System.DictType>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="dictId"
          key="dictTypeList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('system:dictType:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('system:dictType:remove')}
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
            <Button
              type="primary"
              key="export"
              hidden={!access.hasPerms('system:dictType:export')}
              onClick={async () => {
                handleExport(intl);
              }}
            >
              <PlusOutlined />
              <FormattedMessage id="pages.searchTable.export" defaultMessage="导出" />
            </Button>,
          ]}
          request={(params) =>
            getDictTypeList({ ...params } as API.System.DictTypeListParams).then((res) => {
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
            hidden={!access.hasPerms('system:dictType:del')}
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
          if (values.dictId) {
            success = await handleUpdate({ ...values } as API.System.DictType, intl);
          } else {
            success = await handleAdd({ ...values } as API.System.DictType, intl);
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
        statusOptions={statusOptions}
      />
    </PageContainer>
  );
};

export default DictTableList;
