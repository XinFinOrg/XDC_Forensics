import {Axios} from 'axios';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

export type ForensicsEventType = 'ATTACK' | 'PRONE_TO_NETWORK';
export type ForenticsType = 'QC' | 'Vote';

export interface BlockInformation {
  blockInfo: {
    Number: string;
    Hash: string;
    Round: string;
    SignersAddress: string[]
  }
  hashPath: string[]
}

export interface QcDetailes {
  attackType: ForensicsEventType;
  suspeciousNodes: string[];
  timeSinceLastEvent?: string;
  divergingBlockNumber: number;
  divergingBlockHash: string;
  divergingPathsMap: RawNodeDatum,
  fork1: BlockInformation;
  fork2: BlockInformation;
}

interface VoteDetailes {
  attackType: ForensicsEventType;
  suspeciousNodes: string[];
  timeSinceLastEvent: string;
}

export interface DetailedReport {
  key: string;
  eventTime: string;
  forensicsType: ForenticsType;
  details: QcDetailes | VoteDetailes;
}

export interface NodeInfo {
  candidate: string;
  createdAt: string;
  owner: string;
  status: string;
  latestSignedBlock: number;
  dataCenter?: {
    location: string;
    name: string;
  }
  hardware?: string;
}

export interface InitialForensicsReports {
  key: string,
  forensicsType: ForenticsType;
  eventTime: string;
  divergingBlockNumber: number;
  divergingBlockHash: string;
  suspeciousNodes: string[];
}

const request = new Axios({
  baseURL: process.env.FORENSICS_URL,
});

// Load the inital content from backend when the page is first landed
export const loadInitialForensicsEvents = async (numOfDays: string): Promise<InitialForensicsReports[]> => {
  // Default is 7
  let range = numOfDays || '7';
  const {data} = await request.get('/batch/load', {
    params: { range }
  });
  return JSON.parse(data);
};

let latestBlocks = {
  highestBlockMined: { 
    blockHash: '',
    blockNumber: '0'
  },
  highestCommittedBlock: {
    blockHash: '',
    blockNumber: '0'
  }
}
export const getLatestBlock = () => {
  return latestBlocks;
}

export const loadNewForensicsReports = async (lastItemId?: string): Promise<InitialForensicsReports[]> => {
  const {data} = await request.get('/load/latest', lastItemId? {
    params: { id: lastItemId }
  }: {});
  const latest = JSON.parse(data);
  // A shortcut to update latest mined block
  if(latest?.latestBlockInfo && latest.highestCommittedBlockInfo) {
    latestBlocks = {
      highestBlockMined: latest.latestBlockInfo,
      highestCommittedBlock: latest.highestCommittedBlockInfo
    }
  }
  
  return latest.forensics;
};

export const getDetailedForensics = async(forensicsId: string): Promise<DetailedReport>  => {
  const {data} = await request.get('/load/detail', {
    params: { id: forensicsId }
  });
  
  return JSON.parse(data);
};


export const getNodeInfo = async(nodeKey: string): Promise<NodeInfo> => {
  try {
    const {data} = await request.get(`/masternode?address=${nodeKey}`);
    const nodeInfo = JSON.parse(data)
    return {
      candidate: nodeInfo.candidate,
      createdAt: nodeInfo.createdAt,
      owner: nodeInfo.owner,
      status: nodeInfo.status,
      latestSignedBlock: nodeInfo.latestSignedBlock,
      dataCenter: nodeInfo.dataCenter,
      hardware: nodeInfo.hardware,
    };
  } catch (error) {
    console.error("Error while fethcing node information", error);
    throw error;
  }
}