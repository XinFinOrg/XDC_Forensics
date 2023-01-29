import * as React from 'react';
import { Modal, Collapse, Spin, Divider, Row, Col } from 'antd';
import { DetailedReport, getDetailedForensics, QcDetailes, VoteDetailes } from '../client/forensicsServer';
import HierarchicalTreeVisualization from './HierarchicalTreeVisualization';
import ForensicsDescription from './ForensicsDescription';
import NodeInfoPanel from './NodeInfoPanel';
import VoteEquivocationDescription from './VoteEquivocationDescription';
const { Panel } = Collapse;

const generateCollapsedNodeInfo = (suspeciousNodes: string[]) => {
  if (suspeciousNodes?.length) {
    const panelList = suspeciousNodes.map(n => {
      return (
        <Panel header={n} key={n}>
          <NodeInfoPanel nodeKey={n}></NodeInfoPanel>
        </Panel>
      );
    })
    
    if (!panelList || !panelList.length) {
      return (
        <div>
          <Spin/>
        </div>
      );
    }
    return (
      <div>
        <Collapse accordion>
          {panelList}
        </Collapse>
      </div>
    )
  }
}

const DetailedForensicsEventModal = (props: {
  handleCancel: () => void;
  isModalVisible: boolean;
  forensicsId: string;
}) => {
  const [detailedReport, setDetailedReport] = React.useState<DetailedReport>(undefined);
  
  React.useEffect(() => {
    (async () => {
      // Only call if the modal is open
      if(props.isModalVisible) {
        const report = await getDetailedForensics(props.forensicsId);
        setDetailedReport(report);
      }
    })();
  }, [props.isModalVisible]);
  
  const showModal = () => {
    if (!detailedReport) {
      return (<Spin></Spin>)
    }
    const forensicsType = detailedReport.forensicsType;
    switch (forensicsType) {
      case 'QC':
        const qcDetails = detailedReport.details as QcDetailes;
        const qcDescriptionData = {
          ...qcDetails,
          eventTime: detailedReport.eventTime
        }
        return (
          <div>
            <ForensicsDescription data={qcDescriptionData}></ForensicsDescription>
            <Row>
              <Col span={16}>
                <Divider orientation="left">Suspecious nodes</Divider>
                {generateCollapsedNodeInfo(qcDetails.suspeciousNodes)}
              </Col>
              <Col span={8}>
                <Divider orientation="left">Forking Chain Visualization</Divider>
                <HierarchicalTreeVisualization data={qcDetails.divergingPathsMap}></HierarchicalTreeVisualization>
              </Col>
            </Row>
          </div>
        )
      case 'Vote':
        const voteDetails = detailedReport.details as VoteDetailes;
        const voteDescriptionData = {
          ...voteDetails,
          eventTime: detailedReport.eventTime
        }
        return (
          <div>
            <VoteEquivocationDescription data={voteDescriptionData}></VoteEquivocationDescription>
            <Row>
              <Col span={24}>
                <Divider orientation="left">Suspecious nodes</Divider>
                {generateCollapsedNodeInfo(voteDetails.suspeciousNodes)}
              </Col>
            </Row>
          </div>
        )
      
      default:
        break;
    }
  }

  return (
    <>
      <Modal title="Detailed forensics event" visible={props.isModalVisible} onCancel={props.handleCancel} destroyOnClose={true} footer={null} width={2000} style={{ top: 20 }}>        
        {showModal()}
      </Modal>
    </>
  );
};


export default React.memo(DetailedForensicsEventModal, (prevProps, nextProps) => prevProps.isModalVisible == nextProps.isModalVisible);