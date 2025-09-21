import React from 'react';
import { Modal, Descriptions, Image, Tag } from 'antd';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

export type PostDetailProps = {
  open: boolean;
  onCancel: () => void;
  values: Record<string, any>;
};

const PostDetail: React.FC<PostDetailProps> = (props) => {
  const { open, onCancel, values } = props;
  const intl = useIntl();

  return (
    <Modal
      title={intl.formatMessage({
        id: 'pages.post.detailTitle',
        defaultMessage: '帖子详情',
      })}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.category',
            defaultMessage: '分类',
          })}
        >
          {values.dynamicsPostCategory?.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.user',
            defaultMessage: '用户',
          })}
        >
          {values.user?.nickName || '-'}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.userAvatar',
            defaultMessage: '用户头像',
          })}
        >
          {values.user?.avatar ? (
            <Image
              src={values.user?.avatar}
              width={60}
              height={60}
              style={{ objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.isPublic',
            defaultMessage: '是否公开',
          })}
        >
          {+values.whetherPublic === 1 ? (
            <Tag color="green">
              {intl.formatMessage({
                id: 'pages.common.yes',
                defaultMessage: '是',
              })}
            </Tag>
          ) : (
            <Tag color="red">
              {intl.formatMessage({
                id: 'pages.common.no',
                defaultMessage: '否',
              })}
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.isRecommend',
            defaultMessage: '是否推荐',
          })}
        >
          {+values.whetherRecommend === 1 ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.forwardNum',
            defaultMessage: '转发数',
          })}
        >
          {values.forwardNum || 0}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.commentNum',
            defaultMessage: '评论数',
          })}
        >
          {values.commentNum || 0}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.likeNum',
            defaultMessage: '点赞数',
          })}
        >
          {values.likesNum || 0}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.common.createTime',
            defaultMessage: '创建时间',
          })}
        >
          {values.createTime ? dayjs(values.createTime).format('YYYY-MM-DD HH:mm') : '-'}
        </Descriptions.Item>
        <Descriptions.Item
          label={intl.formatMessage({
            id: 'pages.post.content',
            defaultMessage: '内容',
          })}
          span={2}
        >
          <div
            style={{
              maxHeight: '300px',
              overflow: 'auto',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {values.content || '-'}
          </div>
        </Descriptions.Item>
        {values.pictures && (
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.post.images',
              defaultMessage: '图片',
            })}
            span={2}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(typeof values.pictures === 'string'
                ? values.pictures.split(',').filter(Boolean)
                : values.pictures
              ).map((image: string, index: number) => (
                <Image
                  key={index}
                  src={image.trim()}
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              ))}
            </div>
          </Descriptions.Item>
        )}
        {values.videos && (
          <Descriptions.Item
            label={intl.formatMessage({
              id: 'pages.post.video',
              defaultMessage: '视频',
            })}
            span={2}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(typeof values.videos === 'string'
                ? values.videos.split(',').filter(Boolean)
                : values.videos
              ).map((video: string, index: number) => (
                <video
                  key={index}
                  src={video.trim()}
                  width={200}
                  height={150}
                  controls
                  style={{ borderRadius: '4px' }}
                  preload="metadata"
                >
                  {intl.formatMessage({
                    id: 'pages.post.videoNotSupported',
                    defaultMessage: '您的浏览器不支持视频播放',
                  })}
                </video>
              ))}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default PostDetail;
