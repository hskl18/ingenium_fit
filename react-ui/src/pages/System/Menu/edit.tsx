import React, { useEffect, useState } from 'react';
import {
  ProForm,
  ProFormDigit,
  ProFormText,
  ProFormRadio,
  ProFormTreeSelect,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Form, Modal} from 'antd';
import { useIntl, FormattedMessage } from '@umijs/max';
import { DataNode } from 'antd/es/tree';
import { createIcon } from '@/utils/IconUtil';
import { DictValueEnumObj } from '@/components/DictTag';
import IconSelector from '@/components/IconSelector';

export type MenuFormData = Record<string, unknown> & Partial<API.System.Menu>;

export type MenuFormProps = {
  onCancel: (flag?: boolean, formVals?: MenuFormData) => void;
  onSubmit: (values: MenuFormData) => Promise<void>;
  open: boolean;
  values: Partial<API.System.Menu>;
  visibleOptions: DictValueEnumObj;
  statusOptions: DictValueEnumObj;
  menuTree: DataNode[];
};

const MenuForm: React.FC<MenuFormProps> = (props) => {

  const [form] = Form.useForm();

  const [menuTypeId, setMenuTypeId] = useState<any>('M');
  const [menuIconName, setMenuIconName] = useState<any>();
  const [iconSelectorOpen, setIconSelectorOpen] = useState<boolean>(false);

  const { menuTree, visibleOptions, statusOptions } = props;

  useEffect(() => {
    form.resetFields();
    setMenuIconName(props.values.icon);
    form.setFieldsValue({
      menuId: props.values.menuId,
      menuName: props.values.menuName,
      menuNameEn: props.values.menuNameEn,
      menuNameZh: props.values.menuNameZh,
      parentId: props.values.parentId,
      orderNum: props.values.orderNum,
      path: props.values.path,
      component: props.values.component,
      query: props.values.query,
      isFrame: props.values.isFrame,
      isCache: props.values.isCache,
      menuType: props.values.menuType,
      visible: props.values.visible,
      status: props.values.status,
      perms: props.values.perms,
      icon: props.values.icon,
      createBy: props.values.createBy,
      createTime: props.values.createTime,
      updateBy: props.values.updateBy,
      updateTime: props.values.updateTime,
      remark: props.values.remark,
    });
  }, [form, props]);

  const intl = useIntl();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleFinish = async (values: Record<string, any>) => {
    props.onSubmit(values as MenuFormData);
  };

  return (
    <Modal
      width={640}
      title={intl.formatMessage({
        id: 'system.menu.title',
        defaultMessage: '编辑菜单权限',
      })}
      open={props.open}
      forceRender
      destroyOnClose
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <ProForm
        form={form}
        grid={true}
        submitter={false}
        layout="horizontal"
        onFinish={handleFinish}>
        <ProFormDigit
          name="menuId"
          label={intl.formatMessage({
            id: 'system.menu.menu_id',
            defaultMessage: '菜单编号',
          })}
          placeholder={intl.formatMessage({
            id: 'system.menu.menu_id.placeholder',
            defaultMessage: '请输入菜单编号',
          })}
          disabled
          hidden={true}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.menu_id.required',
                defaultMessage: '请输入菜单编号！',
              }),
            },
          ]}
        />
        <ProFormTreeSelect
          name="parentId"
          label={intl.formatMessage({
            id: 'system.menu.parent_id',
            defaultMessage: '上级菜单',
          })}
          params={{menuTree}}
          request={async () => {
            return menuTree;
          }}
          placeholder={intl.formatMessage({
            id: 'system.menu.parent_id.placeholder',
            defaultMessage: '请输入父菜单编号',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'system.menu.parent_id.required',
                defaultMessage: '请输入父菜单编号！',
              }),
            },
          ]}
          fieldProps = {{
            defaultValue: 0
          }}
        />
        <ProFormRadio.Group
          name="menuType"
          valueEnum={{
            M: intl.formatMessage({
              id: 'system.menu.type.directory',
              defaultMessage: '目录',
            }),
            C: intl.formatMessage({
              id: 'system.menu.type.menu',
              defaultMessage: '菜单',
            }),
            F: intl.formatMessage({
              id: 'system.menu.type.button',
              defaultMessage: '按钮',
            }),
          }}
          label={intl.formatMessage({
            id: 'system.menu.menu_type',
            defaultMessage: '菜单类型',
          })}
          placeholder={intl.formatMessage({
            id: 'system.menu.menu_type.placeholder',
            defaultMessage: '请输入菜单类型',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.menu_type.required',
                defaultMessage: '请输入菜单类型！',
              }),
            },
          ]}
          fieldProps={{
            defaultValue: 'M',
            onChange: (e) => {
              setMenuTypeId(e.target.value);
            },
          }}
        />
        <ProFormSelect
          name="icon"
          label={intl.formatMessage({
            id: 'system.menu.icon',
            defaultMessage: '菜单图标',
          })}
          valueEnum={{}}
          hidden={menuTypeId === 'F'}
          addonBefore={createIcon(menuIconName)}
          fieldProps={{
            onClick: () => {
              setIconSelectorOpen(true);
            },
          }}
          placeholder={intl.formatMessage({
            id: 'system.menu.icon.placeholder',
            defaultMessage: '请输入菜单图标',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.icon.required',
                defaultMessage: '请输入菜单图标！',
              }),
            },
          ]}
        />
        <ProFormText
          name="menuNameZh"
          label={intl.formatMessage({
            id: 'system.menu.menu_name_zh',
            defaultMessage: '菜单名称(中文)',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.menu_name_zh.placeholder',
            defaultMessage: '请输入菜单名称(中文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'system.menu.menu_name.required',
                defaultMessage: '请输入菜单名称！',
              }),
            },
          ]}
        /><ProFormText
          name="menuNameEn"
          label={intl.formatMessage({
            id: 'system.menu.menu_name_en',
            defaultMessage: '菜单名称(英文)',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.menu_name_en.placeholder',
            defaultMessage: '请输入菜单名称(英文)',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'system.menu.menu_name.required',
                defaultMessage: '请输入菜单名称！',
              }),
            },
          ]}
        />
        <ProFormDigit
          name="orderNum"
          label={intl.formatMessage({
            id: 'system.menu.order_num',
            defaultMessage: '显示顺序',
          })}
          width="lg"
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.order_num.placeholder',
            defaultMessage: '请输入显示顺序',
          })}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.order_num.required',
                defaultMessage: '请输入显示顺序！',
              }),
            },
          ]}
          fieldProps = {{
            defaultValue: 1
          }}
        />
        <ProFormRadio.Group
          name="isFrame"
          valueEnum={{
            0: intl.formatMessage({
              id: 'pages.common.yes',
              defaultMessage: '是',
            }),
            1: intl.formatMessage({
              id: 'pages.common.no',
              defaultMessage: '否',
            }),
          }}
          initialValue="1"
          label={intl.formatMessage({
            id: 'system.menu.is_frame',
            defaultMessage: '是否为外链',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.is_frame.placeholder',
            defaultMessage: '请输入是否为外链',
          })}
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.is_frame.required',
                defaultMessage: '请输入是否为外链！',
              }),
            },
          ]}
          fieldProps = {{
            defaultValue: '1'
          }}
        />
        <ProFormText
          name="path"
          label={intl.formatMessage({
            id: 'system.menu.path',
            defaultMessage: '路由地址',
          })}
          width="lg"
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.path.placeholder',
            defaultMessage: '请输入路由地址',
          })}
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: menuTypeId !== 'F',
              message: intl.formatMessage({
                id: 'system.menu.path.required',
                defaultMessage: '请输入路由地址！',
              }),
            },
          ]}
        />
        <ProFormText
          name="component"
          label={intl.formatMessage({
            id: 'system.menu.component',
            defaultMessage: '组件路径',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.component.placeholder',
            defaultMessage: '请输入组件路径',
          })}
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.component.required',
                defaultMessage: '请输入组件路径！',
              }),
            },
          ]}
        />
        <ProFormText
          name="query"
          label={intl.formatMessage({
            id: 'system.menu.query',
            defaultMessage: '路由参数',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.query.placeholder',
            defaultMessage: '请输入路由参数',
          })}
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.query.required',
                defaultMessage: '请输入路由参数！',
              }),
            },
          ]}
        />
        <ProFormText
          name="perms"
          label={intl.formatMessage({
            id: 'system.menu.perms',
            defaultMessage: '权限标识',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.perms.placeholder',
            defaultMessage: '请输入权限标识',
          })}
          hidden={menuTypeId === 'M'}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.perms.required',
                defaultMessage: '请输入权限标识！',
              }),
            },
          ]}
        />
        <ProFormRadio.Group
          name="isCache"
          valueEnum={{
            0: intl.formatMessage({
              id: 'system.menu.cache.yes',
              defaultMessage: '缓存',
            }),
            1: intl.formatMessage({
              id: 'system.menu.cache.no',
              defaultMessage: '不缓存',
            }),
          }}
          label={intl.formatMessage({
            id: 'system.menu.is_cache',
            defaultMessage: '是否缓存',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.is_cache.placeholder',
            defaultMessage: '请输入是否缓存',
          })}
          hidden={menuTypeId !== 'C'}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.is_cache.required',
                defaultMessage: '请输入是否缓存！',
              }),
            },
          ]}
          fieldProps = {{
            defaultValue: 0
          }}
        />
        <ProFormRadio.Group
          name="visible"
          valueEnum={visibleOptions}
          label={intl.formatMessage({
            id: 'system.menu.visible',
            defaultMessage: '显示状态',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.visible.placeholder',
            defaultMessage: '请输入显示状态',
          })}
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: false,
              message: intl.formatMessage({
                id: 'system.menu.visible.required',
                defaultMessage: '请输入显示状态！',
              }),
            },
          ]}
          fieldProps = {{
            defaultValue: '0'
          }}
        />
        <ProFormRadio.Group
          valueEnum={statusOptions}
          name="status"
          label={intl.formatMessage({
            id: 'system.menu.status',
            defaultMessage: '菜单状态',
          })}
          colProps={{ md: 12, xl: 12 }}
          placeholder={intl.formatMessage({
            id: 'system.menu.status.placeholder',
            defaultMessage: '请输入菜单状态',
          })}
          hidden={menuTypeId === 'F'}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'system.menu.status.required',
                defaultMessage: '请输入菜单状态！',
              }),
            },
          ]}
          fieldProps = {{
            defaultValue: '0'
          }}
        />
      </ProForm>
      <Modal
        width={800}
        open={iconSelectorOpen}
        onCancel={() => {
          setIconSelectorOpen(false);
        }}
        footer={null}
      >
        <IconSelector
          onSelect={(name: string) => {
            form.setFieldsValue({ icon: name });
            setMenuIconName(name);
            setIconSelectorOpen(false);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default MenuForm;
