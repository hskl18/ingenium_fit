import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Row, Col, Statistic, List, Spin, Typography, Select, DatePicker } from 'antd';
import { Column } from '@ant-design/plots';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from '@umijs/max';
import { numberModelStatistics, barChartModelStatistics, rankingListModelStatistics } from '@/services/business';

const { Text } = Typography;

// 统计数据类型定义
interface StatisticItem {
  cumulativeNumber: number;
  todayNumber: number;
  yesterdayNumber: number;
  annulus: number;
}

interface NumberStatistics {
  userStatistics: StatisticItem;
  followStatistics: StatisticItem;
  scienceStatistics: StatisticItem;
  rehabilitationCenterStatistics: StatisticItem;
  dynamicsPostStatistics: StatisticItem;
  leaveWordStatistics: StatisticItem;
  giveLikeStatistics: StatisticItem;
  favoriteStatistics: StatisticItem;
}

interface BarChartData {
  timestamp: number;
  peopleCount: number;
  date?: string;
}

interface RankingItem {
  rankingObject: string;
  rankingResult: string;
}

interface RankingData {
  dynamicsPostRankingList: RankingItem[];
  userGiveLikeRankingList: RankingItem[];
}

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [numberStats, setNumberStats] = useState<NumberStatistics | null>(null);
  const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
  const [rankingData, setRankingData] = useState<RankingData | null>(null);
  const [timeType, setTimeType] = useState(1); // 1-近一年 2-近一月 3-时间自定义
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // 并行请求所有统计数据
      const [numberRes, barChartRes, rankingRes] = await Promise.all([
        numberModelStatistics(),
        barChartModelStatistics({
          timeType: timeType,
          startTimestamp: startTime,
          endTimestamp: endTime
        }),
        rankingListModelStatistics()
      ]);

      if (numberRes.code === 200) {
        setNumberStats(numberRes.data);
      }

      if (barChartRes.code === 200) {
        setBarChartData(barChartRes.data);
      }

      if (rankingRes.code === 200) {
        setRankingData(rankingRes.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理时间类型变化
  const handleTimeTypeChange = (value: number) => {
    setTimeType(value);
    if (value !== 3) {
      setStartTime('');
      setEndTime('');
    }
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setStartTime(dates[0].valueOf().toString());
      setEndTime(dates[1].valueOf().toString());
    } else {
      setStartTime('');
      setEndTime('');
    }
  };

  // 重新获取数据
  const handleRefresh = () => {
    fetchStatistics();
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (timeType !== 3 || (timeType === 3 && startTime && endTime)) {
      fetchStatistics();
    }
  }, [timeType, startTime, endTime]);

  // 处理图表数据，将时间戳转换为日期
  const processedChartData = barChartData.map(item => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }));

  // 柱状图配置
  const columnConfig = {
    data: processedChartData,
    xField: 'date',
    yField: 'peopleCount',
    tooltip:{
      title: 'date', // 标题
      items: [{
        field: 'date',
        name: intl.formatMessage({
          id: 'pages.index.date',
          defaultMessage: '日期',
        }),
      },{
        field: 'peopleCount',
        name: intl.formatMessage({
          id: 'pages.index.peopleCount',
          defaultMessage: '人数',
        }),
      },], // 数据项
    },
    color: '#1890ff',
    style: {
    },
    label: {
      position: 'top',
      style: {
        fill: '#666',
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
    },
  };

  return (
    <PageContainer>
      <Spin spinning={loading}>
        {/* 数量统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                   {numberStats?.userStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.userStatistics',
                       defaultMessage: '用户统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.userStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.userStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.userStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.userStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.userStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                   {numberStats?.followStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.followStatistics',
                       defaultMessage: '关注统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.followStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.followStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.followStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.followStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.followStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                   {numberStats?.scienceStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.scienceStatistics',
                       defaultMessage: '科普统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.scienceStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.scienceStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.scienceStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.scienceStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.scienceStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                   {numberStats?.dynamicsPostStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.dynamicsStatistics',
                       defaultMessage: '动态统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.dynamicsPostStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.dynamicsPostStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.dynamicsPostStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.dynamicsPostStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.dynamicsPostStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
        </Row>

        {/* 第二行统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                   {numberStats?.rehabilitationCenterStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.rehabilitationCenter',
                       defaultMessage: '康复中心',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.rehabilitationCenterStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.rehabilitationCenterStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.rehabilitationCenterStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.rehabilitationCenterStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.rehabilitationCenterStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>
                   {numberStats?.leaveWordStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.messageStatistics',
                       defaultMessage: '留言统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.leaveWordStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.leaveWordStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.leaveWordStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.leaveWordStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.leaveWordStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#eb2f96' }}>
                   {numberStats?.giveLikeStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.likeStatistics',
                       defaultMessage: '点赞统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.giveLikeStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.giveLikeStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.giveLikeStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.giveLikeStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.giveLikeStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
          <Col xs={24} sm={12} lg={6}>
             <Card>
               <div style={{ position: 'relative', height: '80px' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                   {numberStats?.favoriteStatistics?.cumulativeNumber || 0}
                 </div>
                 <div style={{ paddingTop: '8px' }}>
                   <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                     {intl.formatMessage({
                       id: 'pages.index.favoriteStatistics',
                       defaultMessage: '收藏统计',
                     })}
                   </div>
                   <div style={{ fontSize: '12px', color: '#666' }}>
                     {intl.formatMessage({
                       id: 'pages.index.today',
                       defaultMessage: '今日',
                     })}: {numberStats?.favoriteStatistics?.todayNumber || 0}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', marginTop: '4px' }}>
                     <span style={{ marginRight: '8px', color: '#666' }}>
                       {intl.formatMessage({
                         id: 'pages.index.yesterday',
                         defaultMessage: '昨日',
                       })}: {numberStats?.favoriteStatistics?.yesterdayNumber || 0}
                     </span>
                     <Text type={(numberStats?.favoriteStatistics?.annulus || 0) >= 0 ? 'success' : 'danger'}>
                       {(numberStats?.favoriteStatistics?.annulus || 0) >= 0 ? (
                         <ArrowUpOutlined style={{ marginRight: '2px' }} />
                       ) : (
                         <ArrowDownOutlined style={{ marginRight: '2px' }} />
                       )}
                       {Math.abs(numberStats?.favoriteStatistics?.annulus || 0)}%
                     </Text>
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
        </Row>

        {/* 筛选器 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{intl.formatMessage({ id: 'pages.index.timeType', defaultMessage: '时间类型' })}:</span>
                  <Select
                    value={timeType}
                    onChange={handleTimeTypeChange}
                    style={{ width: 120 }}
                    options={[
                      { value: 1, label: intl.formatMessage({ id: 'pages.index.nearYear', defaultMessage: '近一年' }) },
                      { value: 2, label: intl.formatMessage({ id: 'pages.index.nearMonth', defaultMessage: '近一月' }) },
                      { value: 3, label: intl.formatMessage({ id: 'pages.index.customTime', defaultMessage: '自定义' }) },
                    ]}
                  />
                </div>
                {timeType === 3 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{intl.formatMessage({ id: 'pages.index.dateRange', defaultMessage: '日期范围' })}:</span>
                    <DatePicker.RangePicker
                      onChange={handleDateRangeChange}
                      placeholder={[
                        intl.formatMessage({ id: 'pages.index.startDate', defaultMessage: '开始日期' }),
                        intl.formatMessage({ id: 'pages.index.endDate', defaultMessage: '结束日期' })
                      ]}
                    />
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 图表和排行榜 */}
        <Row gutter={[16, 16]}>
          {/* 柱状图 */}
          <Col xs={24}>
            <Card title={intl.formatMessage({
              id: 'pages.index.registrationCount',
              defaultMessage: '注册人数',
            })} style={{ height: 400 }}>
              {processedChartData.length > 0 ? (
                 <Column {...columnConfig} height={320} />
               ) : (
                 <div style={{
                   height: 320,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: token.colorTextSecondary
                 }}>
                   {intl.formatMessage({
                     id: 'pages.index.noData',
                     defaultMessage: '暂无数据',
                   })}
                 </div>
               )}
            </Card>
          </Col>

          {/* 排行榜 */}
           <Col xs={24} >
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 400 }}>
               {/* 发布动态排行榜 */}
               <Card title={intl.formatMessage({
                 id: 'pages.index.dynamicsRanking',
                 defaultMessage: '发布动态排行',
               })} style={{ flex: 1 }}>
                 <List
                   size="small"
                   dataSource={rankingData?.dynamicsPostRankingList || []}
                   renderItem={(item, index) => (
                     <List.Item style={{ padding: '8px 0' }}>
                       <List.Item.Meta
                         avatar={
                           <div
                             style={{
                               width: 24,
                               height: 24,
                               borderRadius: '50%',
                               backgroundColor:
                                 index < 3
                                   ? ['#f5222d', '#fa8c16', '#faad14'][index]
                                   : token.colorBgTextHover,
                               color: '#fff',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               fontWeight: 'bold',
                               fontSize: '12px',
                             }}
                           >
                             {index + 1}
                           </div>
                         }
                         title={
                           <div style={{ fontSize: '14px' }}>
                             {item.rankingObject}
                           </div>
                         }
                         description={
                           <div style={{ fontSize: '12px', color: '#666' }}>
                             {item.rankingResult} {intl.formatMessage({
                               id: 'pages.index.articles',
                               defaultMessage: '篇',
                             })}
                           </div>
                         }
                       />
                     </List.Item>
                   )}
                 />
               </Card>

               {/* 用户点赞排行榜 */}
               <Card title={intl.formatMessage({
                 id: 'pages.index.likeRanking',
                 defaultMessage: '用户点赞排行',
               })} style={{ flex: 1 }}>
                 <List
                   size="small"
                   dataSource={rankingData?.userGiveLikeRankingList || []}
                   renderItem={(item, index) => (
                     <List.Item style={{ padding: '8px 0' }}>
                       <List.Item.Meta
                         avatar={
                           <div
                             style={{
                               width: 24,
                               height: 24,
                               borderRadius: '50%',
                               backgroundColor:
                                 index < 3
                                   ? ['#eb2f96', '#722ed1', '#13c2c2'][index]
                                   : token.colorBgTextHover,
                               color: '#fff',
                               display: 'flex',
                               alignItems: 'center',
                               justifyContent: 'center',
                               fontWeight: 'bold',
                               fontSize: '12px',
                             }}
                           >
                             {index + 1}
                           </div>
                         }
                         title={
                           <div style={{ fontSize: '14px' }}>
                             {item.rankingObject}
                           </div>
                         }
                         description={
                           <div style={{ fontSize: '12px', color: '#666' }}>
                             {item.rankingResult} {intl.formatMessage({
                               id: 'pages.index.times',
                               defaultMessage: '次',
                             })}
                           </div>
                         }
                       />
                     </List.Item>
                   )}
                 />
               </Card>
             </div>
           </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default Welcome;
