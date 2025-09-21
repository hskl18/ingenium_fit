// Google Maps 配置
export const GOOGLE_MAPS_CONFIG = {
  // 请在这里设置您的 Google Maps API 密钥
  // 获取方式：https://developers.google.com/maps/documentation/javascript/get-api-key
  API_KEY: 'AIzaSyCrA6EbhKM6SJ2kFU7DpCltQwBWpe1k9dI' || 'YOUR_GOOGLE_MAPS_API_KEY',

  // SDK 配置
  SDK_OPTIONS: {
    version: 'weekly',
    libraries: ['places'] as const,
    language: 'zh-CN',
  },

  // 默认地图配置
  DEFAULT_CENTER: {
    lat: 40.7128, // 纽约
    lng: -74.0060
  },

  // 地图选项
  MAP_OPTIONS: {
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
     mapId: 'ff2268c265ce7a40',
  },

  // 自动完成配置
  AUTOCOMPLETE_OPTIONS: {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'us' }, // 限制为美国
  },

  // 支持的语言（保持向后兼容）
  LANGUAGE: 'zh-CN',
};

// 检查 API 密钥是否已配置
export const isGoogleMapsConfigured = () => {
  return GOOGLE_MAPS_CONFIG.API_KEY && GOOGLE_MAPS_CONFIG.API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY';
};
