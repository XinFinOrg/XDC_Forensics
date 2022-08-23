import * as React from 'react';
import { Table, Segmented, Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';


import { InitialForensicsReports, loadInitialForensicsEvents, loadNewForensicsReports } from '../client/forensicsServer';
import DetailedForensicsEventModal from './DetailedForensicsEventModal';



export const LAST_7_DAYS = 'Last 7 Days';
export const LAST_30_DAYS = 'Last 30 Days';
export const ALL_HISTORY = 'All History';

const ForensicsTable = () => {
  const [segmentValue, setSegmentValue]: [string, (v: string) => void] = React.useState<string>(LAST_7_DAYS);
  const [forensicsReports, setForensicsReports] = React.useState<InitialForensicsReports[]>([]);
  
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  
  const [selectedForensicsId, setSelectedForensicsEventId] = React.useState('');
  const showModal = (key: React.Key) => {
    setIsModalVisible(true);
    setSelectedForensicsEventId(key.toString());
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  const onSegmentValueChange = (v: string) => {
    setForensicsReports([]);
    setSegmentValue(v);
  };
  
  const subscribeToRealtimeForensicsReport = () => {
    setInterval(async () => {
      let searchingKey;
      if(forensicsReports.length) {
        searchingKey = forensicsReports[0].key;
      }
      const newForensicsReports = await loadNewForensicsReports(searchingKey);
      if (newForensicsReports.length) {
        setForensicsReports(p => ([...newForensicsReports, ...p]));
      }
    }, 5000);
  };
  React.useEffect(() => {
    subscribeToRealtimeForensicsReport();
  }, []);
  
  
  
const columns: ColumnsType<InitialForensicsReports> = [
  {
    title: 'Diverging Number',
    width: 250,
    dataIndex: 'divergingBlockNumber',
    key: 'divergingBlockNumber',
    fixed: 'left',
  },
  {
    title: 'Diverging Hash',
    width: 300,
    dataIndex: 'divergingBlockHash',
    key: 'divergingBlockHash',
    fixed: 'left',
  },
  
  {
    title: 'Type',
    width: 100,
    dataIndex: 'forensicsType',
    key: 'forensicsType',
    fixed: 'left',
    render: (_, { forensicsType }) => {
      let color = 'green';
      if (forensicsType === 'QC') {
        color = 'volcano';
      }
      return (
        <Tag color={color} key={forensicsType}>
          {forensicsType}
        </Tag>
      );    
    },
  },
  {
    title: 'Num. Suspecious nodes',
    width: 150,
    dataIndex: 'numberOfSuspeciousNodes',
    key: 'numberOfSuspeciousNodes',
    fixed: 'left',
  },

  {
    title: 'Time(UTC)',
    width: 300,
    dataIndex: 'eventTime',
    key: 'eventTime',
    fixed: 'left',
    render: (_, { eventTime }) => {
      return (
        <div>
          {new Date(eventTime).toLocaleString('en-GB', { timeZone: 'UTC' })}
        </div>
      );    
    },
  },
  {
    title: 'Action',
    key: 'action',
    dataIndex: 'action',
    fixed: 'right',
    width: 150,
    render: (_, record: { key: React.Key }) => forensicsReports.length >= 1 ? (
      <Button type="primary" onClick={() => showModal(record.key)}>
        Show more
      </Button>
    ) : null,
  },
];
  
  React.useEffect(() => {
    let isSubscribed = true;
    // Fetch the inital report
    const fetchAndSetInitialReports = async() => {
      let numOfDays = '7';
      switch (segmentValue) {
        case LAST_7_DAYS:
          numOfDays = '7';
          break;
        case LAST_30_DAYS:
          numOfDays = '30';
        case ALL_HISTORY:
          numOfDays = 'all';
      }
      const reports = await loadInitialForensicsEvents(numOfDays);
      if (isSubscribed) {
        setForensicsReports(p => ([...reports, ...p]));
      }
    };
    fetchAndSetInitialReports();
    return () => {
      isSubscribed=false;
    };
  }, [segmentValue]);

  return (
    <div>
      <Segmented size="large" options={[LAST_7_DAYS, LAST_30_DAYS, ALL_HISTORY]} value={segmentValue} onChange={onSegmentValueChange}/>
      <br></br>
      <Table columns={columns} dataSource={forensicsReports} scroll={{ x: 1300 }} />
      <DetailedForensicsEventModal isModalVisible={isModalVisible} handleCancel={handleCancel} forensicsId={selectedForensicsId}></DetailedForensicsEventModal>
    </div>
  ); 
};

export default ForensicsTable;