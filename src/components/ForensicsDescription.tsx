import * as React from 'react';
import { Collapse, Descriptions, Timeline} from 'antd';
import * as moment from 'moment';
const { Panel } = Collapse;

import ForensicsReasonTag from './ForensicsReasonTag';
import { BlockInformation, ForensicsEventType } from '../client/forensicsServer';


export interface ForensicsDescriptionProps {
  data: {
    fork1: BlockInformation;
    fork2: BlockInformation;
    eventTime: string;
    attackType: ForensicsEventType;
    timeSinceLastEvent?: string;
  }
}

const CollapsedHashPath = (hashPath: string[]) => {
  return (
    <Collapse collapsible="header" defaultActiveKey={['1']}>
      <Panel header="Forking chain hashes" key="1">
        <Timeline>
          {
            hashPath.map(h => {
              return  <Timeline.Item key={h}>{h}</Timeline.Item>
            })
          }
        </Timeline>
      </Panel>
    </Collapse>
  );
}

const ForensicsDescription = (props: ForensicsDescriptionProps) => {
  return (
    <div>
      <Descriptions bordered>
        <Descriptions.Item label="Fork 1 Block Info" span={2}>
          <div>
            Block Number: {props.data.fork1.blockInfo.Number || ''}
            <br/>
            Block Hash: {props.data.fork1.blockInfo.Hash || ''}
            <br/>
            Block Round {props.data.fork1.blockInfo.Round || ''}
          </div>
          <br/>
          {CollapsedHashPath(props.data.fork1.hashPath)}
        </Descriptions.Item>
        
        <Descriptions.Item label="Fork 2 Block Info" span={2}>
          <div>
              Block Number: {props.data.fork2.blockInfo.Number || ''}
              <br/>
              Block Hash: {props.data.fork2.blockInfo.Hash || ''}
              <br/>
              Block Round {props.data.fork2.blockInfo.Round || ''}
          </div>
          <br/>
          {CollapsedHashPath(props.data.fork2.hashPath)}
        </Descriptions.Item>

        <Descriptions.Item label="Type" span={3}>
          <ForensicsReasonTag eventType={props.data.attackType} forensicsType="Quorum Certificate"></ForensicsReasonTag>
        </Descriptions.Item>
        <Descriptions.Item label="Event Time(UTC)">{new Date(props.data.eventTime).toLocaleString('en-GB', { timeZone: 'UTC' })}</Descriptions.Item>
        <Descriptions.Item label="Time since last event" span={2}>
          {props.data.timeSinceLastEvent? moment.duration(props.data.timeSinceLastEvent).humanize(true): 'Nah'}
        </Descriptions.Item>
        
      </Descriptions>
    </div>
    
  )
}

export default React.memo(ForensicsDescription);