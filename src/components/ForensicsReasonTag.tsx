import * as React from 'react';
import { ForensicsEventType } from '../client/forensicsServer';
import { Alert } from 'antd';

export enum ForensicsReasonType {
  ATTACK = 'Deliberate Attack',
  PRONE_TO_NETWORK = 'Slow network'
}

const ForensicsReasonTag = ({eventType}: { eventType: ForensicsEventType}) => {
  const generateTag = () => {
    switch (eventType) {
      case 'ATTACK':
        return (
            <Alert
            message={ForensicsReasonType.ATTACK}
            description="The forking is caused by some nodes deliberate attacking the network with faulty Quorum Cert"
            type="error"
            showIcon
          />
        );
      case 'PRONE_TO_NETWORK':
        return (
            <Alert
            message={ForensicsReasonType.PRONE_TO_NETWORK}
            description="The forking is caused by high latency from some nodes"
            type="warning"
            showIcon
          />
        );
      default:
        break;
    }
  }
  return (
    <div>
      {generateTag()}
    </div>
  )
}

export default React.memo(ForensicsReasonTag);