import * as React from 'react';
import { Collapse, Descriptions } from 'antd';
import * as moment from 'moment';
const { Panel } = Collapse;

import ForensicsReasonTag from './ForensicsReasonTag';
import { ForensicsEventType, VoteInformation } from '../client/forensicsServer';


export interface VoteEquivocationDescriptionProps {
  data: {
    eventTime: string;
    attackType: ForensicsEventType;
    timeSinceLastEvent?: string;
    vote1: VoteInformation;
    vote2: VoteInformation;
  }
}

const VoteEquivocationDescription = (props: VoteEquivocationDescriptionProps) => {
  return (
    <div>
      <Descriptions bordered>
        <Descriptions.Item label="Vote 1 Block Info" span={2}>
          <div>
            Block Number: {props.data.vote1.blockInfo.Number || ''}
            <br/>
            Block Hash: {props.data.vote1.blockInfo.Hash || ''}
            <br/>
            Block Round {props.data.vote1.blockInfo.Round || ''}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="Vote 2 Block Info" span={2}>
          <div>
              Block Number: {props.data.vote2.blockInfo.Number || ''}
              <br/>
              Block Hash: {props.data.vote2.blockInfo.Hash || ''}
              <br/>
              Block Round {props.data.vote2.blockInfo.Round || ''}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Type" span={3}>
          <ForensicsReasonTag eventType={props.data.attackType} forensicsType="Vote"></ForensicsReasonTag>
        </Descriptions.Item>
        <Descriptions.Item label="Event Time(UTC)">{new Date(props.data.eventTime).toLocaleString('en-GB', { timeZone: 'UTC' })}</Descriptions.Item>
        <Descriptions.Item label="Time since last event" span={2}>
          {props.data.timeSinceLastEvent? moment.duration(props.data.timeSinceLastEvent).humanize(true): 'Nah'}
        </Descriptions.Item>
        
      </Descriptions>
    </div>
    
  )
}

export default React.memo(VoteEquivocationDescription);