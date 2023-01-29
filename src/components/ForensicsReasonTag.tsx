import * as React from 'react';
import { ForensicsEventType } from '../client/forensicsServer';
import { Alert } from 'antd';

export enum ForensicsReasonType {
  ATTACK = 'Deliberate Attack',
  PRONE_TO_NETWORK = 'Slow network'
}

const ForensicsReasonTag = ({eventType, forensicsType}: { eventType: ForensicsEventType, forensicsType: string}) => {
  const generateTag = () => {
    switch (eventType) {
      case 'ATTACK':
        return (
            <Alert
            message={ForensicsReasonType.ATTACK}
            description={`Some nodes deliberate attacking the network with faulty ${forensicsType}`}
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