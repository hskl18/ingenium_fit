# Google Maps 地址选择器组件

这是一个基于 Google Maps API 的地址选择器组件，支持地图点击选择、拖拽标记和搜索地址功能。

## 功能特性

- 🗺️ 交互式地图界面
- 📍 点击地图选择位置
- 🔍 地址搜索自动完成
- 📌 拖拽标记调整位置
- 🌐 反向地理编码获取地址
- 📱 响应式设计
- 🌏 支持中文界面

## 配置要求

### 1. 安装依赖

项目已安装 `@googlemaps/js-api-loader` SDK，无需额外安装。

### 2. 获取 Google Maps API 密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用以下 API：
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. 创建 API 密钥
5. 设置 API 密钥的使用限制（推荐）

### 3. 配置 API 密钥

#### 方法一：环境变量（推荐）

在项目根目录创建 `.env.local` 文件：

```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### 方法二：直接修改配置文件

编辑 `src/config/maps.ts` 文件：

```typescript
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: 'your_api_key_here',
  // ... 其他配置
};
```

### 4. SDK 配置

组件使用 `@googlemaps/js-api-loader` SDK 的推荐加载方式，具有以下优势：

- ✅ 使用 `importLibrary` 方法按需加载
- ✅ 避免全局 window 对象污染
- ✅ 更好的类型支持和错误处理
- ✅ 支持 Tree Shaking 和代码分割
- ✅ 更现代化的异步加载机制
- ✅ 更好的开发体验和调试能力

## 使用方法

### 基本用法

```tsx
import GoogleMapsPicker from '@/components/GoogleMapsPicker';

const MyForm = () => {
  const [addressInfo, setAddressInfo] = useState({
    address: '',
    latitude: 0,
    longitude: 0,
  });

  return (
    <GoogleMapsPicker
      value={addressInfo}
      onChange={setAddressInfo}
      placeholder="请选择地址"
    />
  );
};
```

### 在 ProForm 中使用

```tsx
import { ProFormItem } from '@ant-design/pro-components';
import GoogleMapsPicker from '@/components/GoogleMapsPicker';

<ProFormItem
  name="addressInfo"
  label="地址"
  rules={[
    {
      required: true,
      message: '请选择地址！',
    },
  ]}
>
  <GoogleMapsPicker placeholder="请选择地址" />
</ProFormItem>
```

## API 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | AddressInfo | - | 当前选中的地址信息 |
| onChange | (value: AddressInfo) => void | - | 地址变化回调 |
| placeholder | string | '请选择地址' | 输入框占位符 |
| disabled | boolean | false | 是否禁用 |

### AddressInfo 类型

```typescript
interface AddressInfo {
  address: string;    // 地址文本
  latitude: number;   // 纬度
  longitude: number;  // 经度
}
```

## 配置选项

可以在 `src/config/maps.ts` 中自定义配置：

```typescript
export const GOOGLE_MAPS_CONFIG = {
  // API 密钥
  API_KEY: 'your_api_key',
  
  // SDK 配置
  SDK_OPTIONS: {
    version: 'weekly',           // API 版本
    libraries: ['places'],       // 加载的库
    language: 'zh-CN',          // 语言设置
  },
  
  // 默认地图中心点
  DEFAULT_CENTER: {
    lat: 39.9042, // 纬度
    lng: 116.4074 // 经度
  },
  
  // 地图选项
  MAP_OPTIONS: {
    zoom: 15,                    // 缩放级别
    mapTypeControl: false,       // 地图类型控件
    streetViewControl: false,    // 街景控件
    fullscreenControl: false,    // 全屏控件
  },
  
  // 自动完成选项
  AUTOCOMPLETE_OPTIONS: {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'cn' }, // 限制国家
  },
};
```

## 注意事项

1. **API 配额**：Google Maps API 有使用配额限制，请合理使用
2. **网络要求**：需要能够访问 Google 服务
3. **HTTPS**：生产环境建议使用 HTTPS
4. **API 密钥安全**：不要在客户端代码中暴露 API 密钥，建议使用环境变量

## 故障排除

### 常见问题

1. **地图无法加载**
   - 检查 API 密钥是否正确配置
   - 确认已启用必要的 Google Maps API
   - 检查网络连接

2. **ProjectDeniedMapError 错误**
   - **原因**：Google Cloud 项目配置问题
   - **解决方案**：
     1. 确认 API 密钥有效且未过期
     2. 在 Google Cloud Console 中启用以下 API：
        - Maps JavaScript API
        - Places API
        - Geocoding API
     3. 检查 API 密钥的使用限制（HTTP 引用来源、IP 地址等）
     4. 确认项目计费已启用
     5. 检查 API 配额是否充足

3. **搜索功能不工作**
   - 确认已启用 Places API
   - 检查 API 密钥权限

4. **反向地理编码失败**
   - 确认已启用 Geocoding API
   - 检查 API 配额是否用完

### 错误信息

- `Google Maps API 密钥未配置`：需要配置有效的 API 密钥
- `Google Maps API 项目配置错误`：ProjectDeniedMapError，需要检查项目设置
- `加载地图失败，请检查网络连接`：网络连接问题或 API 服务不可用

### 详细错误解决方案

#### ProjectDeniedMapError 完整解决步骤

1. **检查 API 密钥**
   ```bash
   # 确认环境变量设置
   echo $REACT_APP_GOOGLE_MAPS_API_KEY
   ```

2. **启用必要的 API**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 进入 "API 和服务" > "库"
   - 搜索并启用以下 API：
     - Maps JavaScript API
     - Places API
     - Geocoding API

3. **配置 API 密钥限制**
   - 进入 "API 和服务" > "凭据"
   - 点击您的 API 密钥
   - 在 "应用限制" 中选择 "HTTP 引用来源"
   - 添加您的域名，例如：`localhost:8000/*`、`yourdomain.com/*`

4. **检查计费设置**
   - 确保项目已关联有效的计费账户
   - Google Maps API 需要启用计费才能使用

5. **验证配额**
   - 检查 API 使用配额是否充足
   - 可以在 "API 和服务" > "配额" 中查看

## 开发建议

1. 在开发环境中使用测试 API 密钥
2. 为生产环境设置 API 密钥使用限制
3. 监控 API 使用量，避免超出配额
4. 考虑添加地图加载状态指示器
5. 为无网络环境提供降级方案