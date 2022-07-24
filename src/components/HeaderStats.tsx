import * as React from "react";
import CardStats from "./CardStats";
import { WarningOutlined, GlobalOutlined, SyncOutlined, LoadingOutlined} from '@ant-design/icons';
import { Typography, Popover } from "antd";
import { getLatestBlock, loadInitialForensicsEvents } from "../client/forensicsServer";

interface Block {
  blockNumber: string,
  blockHash: string,
}

interface LatestSummary {
  latestCommittedBlock?: Block;
  numberOfAttackEvents?: string;
  numberOfAttackers?: string;
}

const getShortHash = (hash?: string) => {
  if (!hash) return '';
  const firstFour = hash.substring(0,4);
  const lastFour = hash.substring(hash.length-4,hash.length);
  return firstFour+'xxx'+lastFour;
};

const HeaderStats = () =>{
  const warningIcon = <WarningOutlined />;
  const globalIcon = <GlobalOutlined />;
  const syncOutlinedIcon = <SyncOutlined spin/>;
  const loadingOutlinedIcon= <LoadingOutlined spin/>;
  
  const [latestSummary, setLatestSummary] = React.useState<LatestSummary>({});
  const [latestBlock, setLatestBlock] = React.useState<{highestBlockMined: Block, highestCommittedBlock: Block}>();

  const periodicallyUpdateLatestBlock = async () => {
    const id = setInterval(async () => {
      const blockInfo = getLatestBlock();
      if (blockInfo) {
        setLatestBlock(blockInfo);
      }
    }, 5000);
    return id;
  };
  
  React.useEffect(()=> {
    periodicallyUpdateLatestBlock();
    const fetchAndSetInitialReports = async() => {
      const reports = await loadInitialForensicsEvents('LAST_1_DAY');
      if(reports) {
        const attackers = reports.flatMap(r => {
          return r.suspeciousNodes
        });
        const uniqueAttackers = attackers?.filter((v,i) => {
          return attackers.indexOf(v) == i
        })?.length || 0;
      
        setLatestSummary({
          numberOfAttackers: uniqueAttackers.toString(),
          numberOfAttackEvents: reports.length.toString()
        })
      }
    };
    fetchAndSetInitialReports();
  },[]);
  return (
    <>
      {/* Header */}
    <div className="relative bg-sky-600 md:pt-32 pb-32 pt-12">
      <div className="px-4 md:px-10 mx-auto w-full ">
        <div>
          {/* Card stats */}
          <div className="flex flex-wrap">
            <Popover content={latestBlock?.highestBlockMined?.blockHash} title='Full hash'>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                  <CardStats
                    statSubtitle="Latest Block"
                    statTitle={latestBlock?.highestBlockMined?.blockNumber || ''}
                    statDescripiron={getShortHash(latestBlock?.highestBlockMined?.blockHash)}
                    statIconColor="bg-green-500"
                    icon={loadingOutlinedIcon}
                  />    
              </div>
            </Popover>
            <Popover content={latestBlock?.highestCommittedBlock?.blockHash} title='Full hash'>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Latest Committed block"
                  statTitle={latestBlock?.highestCommittedBlock?.blockNumber || ''}
                  statDescripiron={getShortHash(latestBlock?.highestCommittedBlock?.blockHash)}
                  statIconColor="bg-blue-500"
                  icon={syncOutlinedIcon}
                />
              </div>
            </Popover>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <CardStats
                statSubtitle="Num. Attack events"
                statTitle={latestSummary?.numberOfAttackEvents || ''}
                statDescripiron="Last 24h"
                statIconColor="bg-red-500"
                icon={warningIcon}
              />
            </div>
            <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
              <CardStats
                statSubtitle="Num. Attackers"
                statTitle={latestSummary?.numberOfAttackers || ''}
                statDescripiron="Last 24h"
                statIconColor="bg-orange-500"
                icon={globalIcon}
              />
            </div>
          </div>
          <div className="mt-10 grid justify-items-center">
            <Typography.Title level={1} >
              XDC Forensics Monitoring
            </Typography.Title>
          </div>
        </div>
      </div>
      
    </div>
  </>
  );
};

export default HeaderStats;