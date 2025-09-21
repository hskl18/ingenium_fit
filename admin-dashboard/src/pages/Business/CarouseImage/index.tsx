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
import { listImage, delImage, addImage, updateImage } from '@/services/business/image';
import UpdateForm from './edit';

export type ImageListItem = {
  id?: number;
  createDept?: string;
  sort?: number;
  objectId?: number;
  imageUrl?: string;
  imageType?: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
};


const ImageTableList: React.FC = () => {
  const formTableRef = useRef<FormInstance>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ImageListItem>();
  const [selectedRows, setSelectedRows] = useState<ImageListItem[]>([]);
  const access = useAccess();
  const intl = useIntl();
  /**
   * 添加节点
   */
  const handleAdd = async (fields: ImageListItem, intl: any) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.adding',
        defaultMessage: '正在添加',
      })
    );
    try {
      const resp = await addImage({ ...fields });
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.addSuccess',
            defaultMessage: '添加成功',
          })
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
        })
      );
      return false;
    }
  };

  /**
   * 更新节点
   */
  const handleUpdate = async (fields: ImageListItem, intl: any) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.updating',
        defaultMessage: '正在更新',
      })
    );
    try {
      const resp = await updateImage(fields);
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.updateSuccess',
            defaultMessage: '更新成功',
          })
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
        })
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
  const handleRemove = async (selectedRows: ImageListItem[], intl: any) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.deleting',
        defaultMessage: '正在删除',
      })
    );
    if (!selectedRows) return true;
    try {
      const resp = await delImage(selectedRows.map((row) => row.id).join(','));
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.deleteSuccess',
            defaultMessage: '删除成功，即将刷新',
          })
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
        })
      );
      return false;
    }
  };

  const handleRemoveOne = async (selectedRow: ImageListItem, intl: any) => {
    const hide = message.loading(
      intl.formatMessage({
        id: 'pages.common.deleting',
        defaultMessage: '正在删除',
      })
    );
    if (!selectedRow) return true;
    try {
      const params = [selectedRow.id];
      const resp = await delImage(params.join(','));
      hide();
      if (resp.code === 200) {
        message.success(
          intl.formatMessage({
            id: 'pages.common.deleteSuccess',
            defaultMessage: '删除成功，即将刷新',
          })
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
        })
      );
      return false;
    }
  };

  const typeOptions = [
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typeIntroduction',
        defaultMessage: '图文介绍',
      }),
      value: 1,
    },
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typeScience',
        defaultMessage: '科普文章',
      }),
      value: 2,
    },
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typePost',
        defaultMessage: '动态',
      }),
      value: 3,
    },
    {
      label: intl.formatMessage({
        id: 'pages.carouseImage.typeProfile',
        defaultMessage: '个人中心页面',
      }),
      value: 4,
    },
  ];

  const columns: ProColumns<ImageListItem>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.carouseImage.type',
        defaultMessage: '类型',
      }),
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: typeOptions,
      },
      render: (_, record) => {
        return record.type
          ? typeOptions.find((item) => Number(item.value) === Number(record.type))?.label
          : '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.carouseImage.image',
        defaultMessage: '图片',
      }),
      dataIndex: 'image',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return record.image ? (
          <Image src={record.image} width={50} height={50} style={{ objectFit: 'cover' }} />
        ) : (
          '-'
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.carouseImage.sort',
        defaultMessage: '排序',
      }),
      dataIndex: 'sort',
      valueType: 'text',
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
          hidden={!access.hasPerms('mgkf:image:edit')}
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
          hidden={!access.hasPerms('mgkf:image:remove')}
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
        <ProTable<ImageListItem>
          headerTitle={intl.formatMessage({
            id: 'pages.searchTable.title',
            defaultMessage: '信息',
          })}
          actionRef={actionRef}
          formRef={formTableRef}
          rowKey="id"
          key="imageList"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              hidden={!access.hasPerms('mgkf:image:add')}
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
              hidden={selectedRows?.length === 0 || !access.hasPerms('mgkf:image:remove')}
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
            listImage({ ...params }).then((res) => {
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
            hidden={!access.hasPerms('mgkf:image:remove')}
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
            success = await handleUpdate({ ...values } as ImageListItem, intl);
          } else {
            success = await handleAdd({ ...values } as ImageListItem, intl);
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

export default ImageTableList;
