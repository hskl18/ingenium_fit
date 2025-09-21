import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Modal, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_CONFIG, isGoogleMapsConfigured } from '@/config/maps';

interface GoogleMapsPickerProps {
  value?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  onChange?: (value: { address: string; latitude: number; longitude: number }) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface GoogleMapsWindow extends Window {
  google?: {
    maps: {
      Map: any;
      Marker: any;
      places: {
        Autocomplete: any;
        PlacesServiceStatus: any;
      };
      event: {
        addListener: any;
      };
      LatLng: any;
    };
  };
}

declare const window: GoogleMapsWindow;

const GoogleMapsPicker: React.FC<GoogleMapsPickerProps> = ({
  value,
  onChange,
  placeholder = '请选择地址',
  disabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(value?.address || '');
  const [selectedLatLng, setSelectedLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(
    value?.latitude && value?.longitude
      ? {
          lat: value.latitude,
          lng: value.longitude,
        }
      : null,
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const autocompleteInstance = useRef<any>(null);
  const searchInputRef = useRef<any>(null);
  const googleMapsRef = useRef<any>(null);
  const placesLibRef = useRef<any>(null);
  const markerLibRef = useRef<any>(null);
  const geocodingLibRef = useRef<any>(null);

  // 使用 SDK 加载 Google Maps API
  const loadGoogleMapsAPI = async () => {
    // 检查 API 密钥配置
    if (!isGoogleMapsConfigured()) {
      const errorMsg = 'Google Maps API 密钥未配置，请设置环境变量 REACT_APP_GOOGLE_MAPS_API_KEY';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // 创建 Loader 实例
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_CONFIG.API_KEY,
        version: GOOGLE_MAPS_CONFIG.SDK_OPTIONS.version,
        libraries: GOOGLE_MAPS_CONFIG.SDK_OPTIONS.libraries,
        language: GOOGLE_MAPS_CONFIG.SDK_OPTIONS.language,
      });

      // 使用推荐的 SDK 加载方式
      const [mapsLibrary, placesLibrary, markerLibrary, geocodingLibrary] = await Promise.all([
        loader.importLibrary('maps'),
        loader.importLibrary('places'),
        loader.importLibrary('marker'),
        loader.importLibrary('geocoding'),
      ]);

      // 验证加载是否成功
      if (!mapsLibrary || !placesLibrary || !markerLibrary || !geocodingLibrary) {
        throw new Error('Google Maps API 加载失败');
      }

      // 保存库引用供后续使用
      googleMapsRef.current = mapsLibrary;
      placesLibRef.current = placesLibrary;
      markerLibRef.current = markerLibrary;
      geocodingLibRef.current = geocodingLibrary;

      console.log('Google Maps API 加载成功');
    } catch (error) {
      console.error('Google Maps API 加载失败:', error);

      // 处理认证相关错误
      if (error instanceof Error) {
        if (
          error.message.includes('ApiNotActivatedMapError') ||
          error.message.includes('ProjectDeniedMapError') ||
          error.message.includes('InvalidKeyMapError')
        ) {
          message.error({
            content:
              'Google Maps API 配置错误，请检查以下设置：\n1. 确认 API 密钥有效且未过期\n2. 启用 Maps JavaScript API\n3. 启用 Places API\n4. 启用 Geocoding API\n5. 检查 API 密钥的使用限制（域名/IP限制）\n6. 确认项目计费已启用\n7. 检查 API 配额是否充足',
            duration: 15,
          });
        }
      }

      throw error;
    }
  };

  useEffect(() => {
    loadGoogleMapsAPI();
  }, [
  ]);

  // 初始化地图
  const initializeMap = async () => {
    try {
      // 确保地图容器存在且是有效的 DOM 元素
      if (!mapRef.current || !googleMapsRef.current || !(mapRef.current instanceof HTMLElement)) {
        console.warn('Map container not ready or Google Maps library not loaded');
        return;
      }

      // 使用配置的默认位置
      const center = selectedLatLng || GOOGLE_MAPS_CONFIG.DEFAULT_CENTER;

      // 创建地图，添加错误处理
      try {
        console.log(googleMapsRef.current);
        console.log(placesLibRef.current);
        console.log(mapRef.current);

        const { Map } = googleMapsRef.current;
        mapInstance.current = new Map(mapRef.current, {
          ...GOOGLE_MAPS_CONFIG.MAP_OPTIONS,
          center: center,
        });
      } catch (mapError) {
        console.log('mapError', mapError);
        console.error('Failed to create Google Map instance:', mapError);
        message.error('地图初始化失败，请稍后重试');
        return;
      }

      // 创建高级标记
      if (markerLibRef.current) {
        const { AdvancedMarkerElement } = markerLibRef.current;
        markerInstance.current = new AdvancedMarkerElement({
          position: center,
          map: mapInstance.current,
          gmpDraggable: true,
        });
      }

      // 如果有已选择的位置，设置标记
      if (selectedLatLng && markerInstance.current) {
        markerInstance.current.position = selectedLatLng;
        mapInstance.current.setCenter(selectedLatLng);
      }

      // 监听地图加载完成后的认证错误
      window.google.maps.event.addListenerOnce(mapInstance.current, 'idle', () => {
        // 检查地图是否正常加载
        console.log('Map loaded successfully');
      });

      // 监听高级标记拖拽事件
      if (markerInstance.current) {
        markerInstance.current.addListener('gmp-dragend', (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          setSelectedLatLng({ lat, lng });

          // 反向地理编码获取地址
          if (geocodingLibRef.current) {
            const { Geocoder } = geocodingLibRef.current;
            const geocoder = new Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
              if (status === 'OK' && results[0]) {
                setSelectedAddress(results[0].formatted_address);
              }
            });
          }
        });
      }

      // 监听地图点击事件
      window.google.maps.event.addListener(mapInstance.current, 'click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLatLng({ lat, lng });

        // 更新高级标记位置
        if (markerInstance.current) {
          markerInstance.current.position = { lat, lng };
        }

        // 反向地理编码获取地址
        if (geocodingLibRef.current) {
          const { Geocoder } = geocodingLibRef.current;
          const geocoder = new Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              setSelectedAddress(results[0].formatted_address);
            }
          });
        }
      });

      // 初始化搜索框自动完成
      if (searchInputRef.current) {
        // 获取 Ant Design Input 组件的实际 input 元素
        const inputElement = searchInputRef.current.input;
        if (inputElement) {
          autocompleteInstance.current = new window.google.maps.places.Autocomplete(
            inputElement,
            GOOGLE_MAPS_CONFIG.AUTOCOMPLETE_OPTIONS,
          );

          // 监听地点选择事件
          window.google.maps.event.addListener(
            autocompleteInstance.current,
            'place_changed',
            () => {
              const place = autocompleteInstance.current.getPlace();
              if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const address = place.formatted_address || place.name;

                setSelectedLatLng({ lat, lng });
                setSelectedAddress(address);

                // 更新地图和标记位置
                mapInstance.current.setCenter({ lat, lng });
                if (markerInstance.current) {
                  markerInstance.current.position = { lat, lng };
                }
              }
            },
          );
        }
      }
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
      if (error instanceof Error) {
        if (error.message.includes('API key not configured')) {
          message.error('Google Maps API 密钥未配置，请联系管理员');
        } else if (error.message.includes('ProjectDeniedMapError')) {
          message.error({
            content:
              'Google Maps API 项目配置错误，请检查以下设置：\n1. 确认 API 密钥有效\n2. 启用 Maps JavaScript API\n3. 启用 Places API\n4. 启用 Geocoding API\n5. 检查 API 密钥的使用限制',
            duration: 10,
          });
        } else {
          message.error('加载地图失败，请检查网络连接');
        }
      } else {
        message.error('加载地图失败，请检查网络连接');
      }
    }
  };

  // 打开地图选择器
  const handleOpenPicker = () => {
    if (disabled) return;
    setIsModalVisible(true);
  };

  // 确认选择
  const handleConfirm = () => {
    if (selectedLatLng && selectedAddress) {
      onChange?.({
        address: selectedAddress,
        latitude: selectedLatLng.lat,
        longitude: selectedLatLng.lng,
      });
      setIsModalVisible(false);
    } else {
      message.warning('请选择一个位置');
    }
  };

  // 取消选择
  const handleCancel = () => {
    setIsModalVisible(false);
    // 恢复到原始值
    setSelectedAddress(value?.address || '');
    setSelectedLatLng(
      value?.latitude && value?.longitude
        ? {
            lat: value.latitude,
            lng: value.longitude,
          }
        : null,
    );
  };

  // 当模态框打开时初始化地图
  useEffect(() => {
    if (isModalVisible) {
      initializeMap();

      // 清理函数
      return () => {
        // 清理地图实例和相关资源
        if (mapInstance.current) {
          try {
            // 清理地图事件监听器
            window.google?.maps?.event?.clearInstanceListeners?.(mapInstance.current);
            mapInstance.current = null;
          } catch (error) {
            console.warn('Error cleaning up map instance:', error);
          }
        }

        if (markerInstance.current) {
          try {
            // 清理高级标记
            markerInstance.current.map = null;
            markerInstance.current = null;
          } catch (error) {
            console.warn('Error cleaning up marker instance:', error);
          }
        }

        if (autocompleteInstance.current) {
          try {
            // 清理自动完成事件监听器
            window.google?.maps?.event?.clearInstanceListeners?.(autocompleteInstance.current);
            autocompleteInstance.current = null;
          } catch (error) {
            console.warn('Error cleaning up autocomplete instance:', error);
          }
        }
      };
    }
  }, [isModalVisible]);

  return (
    <>
      <Input
        value={value?.address || ''}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        suffix={
          <Button
            type="text"
            icon={<EnvironmentOutlined />}
            onClick={handleOpenPicker}
            disabled={disabled}
          >
            选择位置
          </Button>
        }
        onClick={handleOpenPicker}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      />

      <Modal
        title="选择地址位置"
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        width={800}
        okText="确认选择"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16 }}>
          <Input ref={searchInputRef} placeholder="搜索地址或地点" style={{ width: '100%' }} />
        </div>

        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '400px',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
          }}
        />

        {selectedAddress && (
          <div style={{ marginTop: 16 }}>
            <strong>已选择地址：</strong>
            <div
              style={{
                padding: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginTop: '4px',
              }}
            >
              {selectedAddress}
            </div>
            {selectedLatLng && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                经度: {selectedLatLng.lng.toFixed(6)}, 纬度: {selectedLatLng.lat.toFixed(6)}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default GoogleMapsPicker;
