import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCronosEvmAsset } from '../../../../hooks/useAsset';
import { renderExplorerUrl } from '../../../../models/Explorer';
import { NftTxsResponseTxModel } from '../../../../service/rpc/indexing/nft/cronos/CronosNftIndexingModels';
import { walletService } from '../../../../service/WalletService';
import { ellipsis, middleEllipsis } from '../../../../utils/utils';

const CronosNFTTransactionList = () => {
  const [nftTransfers, setNftTransfers] = useState<NftTxsResponseTxModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [t] = useTranslation();
  const cronosAsset = useCronosEvmAsset();

  useEffect(() => {
    const fetchNftTransfers = async () => {
      setIsLoading(true);
      const txs = await walletService.retrieveCronosNFTTxs();
      setNftTransfers(txs);
      setIsLoading(false);
    };

    fetchNftTransfers();
  }, []);

  const NftTransactionColumns: ColumnsType<NftTxsResponseTxModel> = [
    {
      title: t('home.transactions.table3.transactionHash'),
      render: (tx: NftTxsResponseTxModel) => {
        const text = tx.tx_hash;
        return (
          <a
            data-original={text}
            target="_blank"
            rel="noreferrer"
            href={`${renderExplorerUrl(cronosAsset?.config, 'tx')}/${text}`}
          >
            {middleEllipsis(text, 6)}
          </a>
        );
      },
    },
    {
      title: t('home.transactions.table3.tokenContractAddress'),
      key: 'tokenContractAddress',
      render: (tx: NftTxsResponseTxModel) => {
        const text = tx.token_address;
        return text ? (
          <a
            data-original={text}
            target="_blank"
            rel="noreferrer"
            href={`${renderExplorerUrl(cronosAsset?.config, 'address')}/${text}`}
          >
            {middleEllipsis(text, 6)}
          </a>
        ) : (
          <div data-original={text}>n.a.</div>
        );
      },
    },
    {
      title: t('home.transactions.table3.tokenName'),
      key: 'tokenName',
      render: (tx: NftTxsResponseTxModel) => {
        const text = tx.token_name;
        return <div data-original={text}>{text ? ellipsis(text, 12) : 'n.a.'}</div>;
      },
    },
    {
      title: t('home.transactions.table3.tokenId'),
      key: 'tokenId',
      render: (tx: NftTxsResponseTxModel) => {
        const text = tx.event_detail.token_id;
        return <div data-original={text}>{text ? ellipsis(text, 12) : 'n.a.'}</div>;
      },
    },
    {
      title: t('home.transactions.table3.recipientAddress'),
      render: (tx: NftTxsResponseTxModel) => {
        const text = tx.event_detail.to;

        return text ? (
          <a
            data-original={text}
            target="_blank"
            rel="noreferrer"
            href={`${renderExplorerUrl(cronosAsset?.config, 'address')}/${text}`}
          >
            {middleEllipsis(text, 12)}
          </a>
        ) : (
          <div data-original={text}>n.a.</div>
        );
      },
    },
    {
      title: t('home.transactions.table3.time'),
      dataIndex: 'time',
      render: text => {
        return new Date(Number(text) * 1000).toLocaleString();
      },
    },
  ];

  return (
    <Table<NftTxsResponseTxModel>
      loading={{
        indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />,
        spinning: isLoading,
      }}
      locale={{
        triggerDesc: t('general.table.triggerDesc'),
        triggerAsc: t('general.table.triggerAsc'),
        cancelSort: t('general.table.cancelSort'),
      }}
      columns={NftTransactionColumns}
      dataSource={nftTransfers}
      rowKey={record =>
        `${record.tx_hash}_${record.event_type}_${record.token_address}_${record.token_name}`
      }
    />
  );
};

export { CronosNFTTransactionList };
