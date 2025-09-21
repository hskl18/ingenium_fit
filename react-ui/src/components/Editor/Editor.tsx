import React, { useState, useRef, useMemo } from 'react';
import { useControlModel, WithControlPropsType } from '@ant-design/pro-form';
import ReactQuill from 'react-quill';
import { message } from 'antd';
import { useIntl } from '@umijs/max';
import 'react-quill/dist/quill.snow.css';
import { uploadFile } from '@/services/business';
import AWSHelper from '@/utils/upload';

export default function Editor(
  props: WithControlPropsType<{
    // other props...
  }>,
) {
  const intl = useIntl();
  const model = useControlModel(props);
  const quillRef = useRef<ReactQuill>(null);

  // 自定义图片上传处理器
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        message.error(
          intl.formatMessage({
            id: 'component.editor.imageTypeError',
            defaultMessage: '只能上传图片文件！',
          }),
        );
        return;
      }

      // 验证文件大小（限制为5MB）
      if (file.size > 5 * 1024 * 1024) {
        message.error(
          intl.formatMessage({
            id: 'component.editor.imageSizeError',
            defaultMessage: '图片大小不能超过5MB！',
          }),
        );
        return;
      }

      try {
        // 这里可以替换为实际的上传逻辑
        const imageUrl = await uploadImage(file);

        // 获取编辑器实例
        const quill = quillRef.current?.getEditor();
        if (quill) {
          // 获取当前光标位置
          const range = quill.getSelection();
          const index = range ? range.index : 0;

          // 插入图片
          quill.insertEmbed(index, 'image', imageUrl);

          // 移动光标到图片后面
          quill.setSelection(index + 1);
        }
      } catch (error) {
        message.error(
          intl.formatMessage({
            id: 'component.editor.imageUploadError',
            defaultMessage: '图片上传失败，请重试！',
          }),
        );
        console.error('图片上传失败:', error);
      }
    };
  };

  // 模拟图片上传函数
  const uploadImage = async (file: File): Promise<string> => {
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

  // ReactQuill 模块配置
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [],
  );

  // ReactQuill 格式配置
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
    'image',
  ];

  return <ReactQuill ref={quillRef} theme="snow" modules={modules} formats={formats} {...model} />;
}
