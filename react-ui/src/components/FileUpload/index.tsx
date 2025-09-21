import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useIntl } from '@umijs/max';
import { uploadFile } from '@/services/business';
import AWSHelper from '@/utils/upload';

export interface FileUploadProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  maxCount?: number;
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  uploadText?: string;
  maxSize?: number; // MB
  multiple?: boolean;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  maxCount = 1,
  accept = 'image/*',
  listType = 'picture-card',
  uploadText,
  maxSize = 10,
  multiple = false,
  disabled = false,
}) => {
  const intl = useIntl();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const defaultUploadText =
    uploadText ||
    intl.formatMessage({
      id: 'component.fileUpload.uploadText',
      defaultMessage: '上传文件',
    });

  // 初始化文件列表
  useEffect(() => {
    if (value) {
      let urls: string[] = [];
      if (typeof value === 'string') {
        urls = value.split(',').filter(Boolean);
      } else if (Array.isArray(value)) {
        urls = value;
      }

      const initialFileList = urls.map((url, index) => ({
        uid: `file-${index}`,
        name: `file-${index}`,
        status: 'done' as const,
        url: url.trim(),
      }));

      setFileList(initialFileList);
    } else {
      setFileList([]);
    }
  }, [value]);

  // 自定义上传方法
  const customUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      AWSHelper.uploadFile(file)
        .then((res) => {
          console.log('res', res);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // 文件上传前的验证
  const beforeUpload = (file: File) => {
    // 检查文件类型
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      message.error(
        intl.formatMessage(
          {
            id: 'component.fileUpload.typeError',
            defaultMessage: '只能上传 {accept} 格式的文件!',
          },
          { accept },
        ),
      );
      return false;
    }

    // 检查文件大小
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLtMaxSize) {
      message.error(
        intl.formatMessage(
          {
            id: 'component.fileUpload.sizeError',
            defaultMessage: '文件大小不能超过 {maxSize}MB!',
          },
          { maxSize },
        ),
      );
      return false;
    }

    return true;
  };

  // 处理文件变化
  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList, file }) => {
    if (file.status === 'uploading') {
      setUploading(true);
    }

    // 处理上传成功的文件
    if (file.status === 'done' || file.originFileObj) {
      try {
        if (file.originFileObj && !file.url) {
          // 使用自定义上传方法
          const url = await customUpload(file.originFileObj);
          file.url = url;
          file.status = 'done';
        }

        setUploading(false);
        setFileList(newFileList);

        // 更新值
        const urls = newFileList.filter((f) => f.status === 'done' && f.url).map((f) => f.url!);

        if (multiple || maxCount > 1) {
          onChange?.(urls);
        } else {
          onChange?.(urls[0] || '');
        }
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'component.fileUpload.uploadError',
            defaultMessage: '上传失败，请重试',
          }),
        );
        setUploading(false);
        // 移除上传失败的文件
        const filteredList = newFileList.filter((f) => f.uid !== file.uid);
        setFileList(filteredList);
      }
    } else if (file.status === 'error') {
      message.error(
        intl.formatMessage({
          id: 'component.fileUpload.uploadFailed',
          defaultMessage: '上传失败',
        }),
      );
      setUploading(false);
    } else {
      setFileList(newFileList);
    }
  };

  // 处理文件删除
  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);

    const urls = newFileList.filter((f) => f.status === 'done' && f.url).map((f) => f.url!);

    if (multiple || maxCount > 1) {
      onChange?.(urls);
    } else {
      onChange?.(urls[0] || '');
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        {uploading
          ? intl.formatMessage({
              id: 'component.fileUpload.uploading',
              defaultMessage: '上传中...',
            })
          : defaultUploadText}
      </div>
    </div>
  );

  return (
    <Upload
      listType={listType}
      fileList={fileList}
      onChange={handleChange}
      onRemove={handleRemove}
      beforeUpload={beforeUpload}
      customRequest={() => {}} // 禁用默认上传，使用自定义上传
      maxCount={maxCount}
      multiple={multiple}
      disabled={disabled || uploading}
      accept={accept}
    >
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  );
};

export default FileUpload;
