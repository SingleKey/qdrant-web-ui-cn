import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useClient } from '../../context/client-context';
import { useSnackbar } from 'notistack';
import { getSnackbarOptions } from '../Common/utils/snackbarOptions';
import { Button, Grid, Link, Table, TableCell, TableRow, Typography } from '@mui/material';
import { Camera } from 'lucide-react';
import {
  StyledTableContainer,
  StyledTableHead,
  StyledHeaderCell,
  StyledTableBody,
  StyledTableRow,
} from '../Common/StyledTable';
import { SnapshotsTableRow } from './SnapshotsTableRow';
import { pumpFile, updateProgress } from '../../common/utils';
import InfoBanner from '../Common/InfoBanner';

export const SnapshotsTab = ({ collectionName }) => {
  const { client: qdrantClient } = useClient();
  const [snapshots, setSnapshots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSnapshotLoading, setIsSnapshotLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const errorSnackbarOptions = getSnackbarOptions('error', closeSnackbar);
  const [localShards, setLocalShards] = useState([]);
  const [remoteShards, setRemoteShards] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    qdrantClient
      .listSnapshots(collectionName)
      .then((res) => {
        setSnapshots([...res]);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, errorSnackbarOptions);
      })
      .finally(() => {
        setIsLoading(false);
      });

    qdrantClient
      .api('cluster')
      .collectionClusterInfo({ collection_name: collectionName })
      .then((res) => {
        const remoteShards = res.data.result.remote_shards;
        const localShards = res.data.result.local_shards;
        if (remoteShards.length > 0) {
          setRemoteShards(remoteShards);
          setLocalShards(localShards);
        }
      })
      .catch((err) => {
        enqueueSnackbar(err.message, errorSnackbarOptions);
      });
  }, [qdrantClient, collectionName]);

  const createSnapshot = () => {
    setIsSnapshotLoading(true);
    qdrantClient
      .createSnapshot(collectionName)
      .then((res) => {
        setSnapshots([...snapshots, res]);
      })
      .catch((err) => {
        enqueueSnackbar(err.message, errorSnackbarOptions);
      })
      .finally(() => {
        setIsSnapshotLoading(false);
      });
  };

  const downloadSnapshot = (snapshotName, snapshotSize, progress, setProgress) => {
    if (progress > 0) {
      enqueueSnackbar(
        '请等待上一个下载完成',
        getSnackbarOptions('warning', closeSnackbar, 2000)
      );
      return;
    }
    qdrantClient
      .downloadSnapshot(collectionName, snapshotName)
      .then((response) => {
        const reader = response.body.getReader();
        const handleProgress = updateProgress(snapshotSize, setProgress);

        return pumpFile(reader, handleProgress);
      })
      .then((chunks) => {
        return new Blob(chunks);
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = snapshotName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
          setProgress(0);
        }, 500);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          enqueueSnackbar('下载已取消', getSnackbarOptions('warning', closeSnackbar, 2000));
          return;
        }
        enqueueSnackbar(error.message, errorSnackbarOptions);
      });
  };

  const deleteSnapshot = (snapshotName) => {
    setIsLoading(true);
    qdrantClient
      .deleteSnapshot(collectionName, snapshotName)
      .then(() => {
        setSnapshots([...snapshots.filter((snapshot) => snapshot.name !== snapshotName)]);
        enqueueSnackbar('快照已成功删除', getSnackbarOptions('success', closeSnackbar, 2000));
      })
      .catch((err) => {
        enqueueSnackbar(err.message, errorSnackbarOptions);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const tableRows = snapshots.map((snapshot) => (
    <SnapshotsTableRow
      key={snapshot.creation_time?.valueOf() || 'unknown'}
      snapshot={snapshot}
      downloadSnapshot={downloadSnapshot}
      deleteSnapshot={deleteSnapshot}
    />
  ));

  return (
    <div>
      <Grid container alignItems="center" spacing={3}>
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Typography variant="h4" component={'h1'}>
            快照
          </Typography>
        </Grid>
        <Grid
          sx={{ display: 'flex', justifyContent: 'end' }}
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Button
            variant={'contained'}
            onClick={createSnapshot}
            startIcon={<Camera size={18} />}
            disabled={isSnapshotLoading}
          >
            拍摄快照
          </Button>
        </Grid>
        {remoteShards && remoteShards.length !== 0 && (
          <InfoBanner severity={'warning'}>
            <Typography>
              快照将不包含完整的集合，它将只包含当前机器上的分片。
            </Typography>

            {localShards.length > 0 && (
              <>
                <Typography>本地分片：</Typography>
                <ul>
                  {localShards.map((shard) => (
                    <Typography component={'li'} key={shard.shard_id}>
                      Id: {shard.shard_id}
                    </Typography>
                  ))}
                </ul>
              </>
            )}
            <>
              <Typography>远程分片（不包含在快照中）：</Typography>
              <ul>
                {remoteShards.map((shard) => (
                  <Typography component={'li'} key={shard.shard_id}>
                    Id: {shard.shard_id} ({shard.peer_id})
                  </Typography>
                ))}
              </ul>
            </>
            <Typography>
              了解更多信息，请访问
              <Link href={'https://qdrant.tech/documentation/tutorials/create-snapshot/'} target="_blank">
                文档
              </Link>
              .
            </Typography>
          </InfoBanner>
        )}
        {isLoading && <div>加载中...</div>}
        {(snapshots?.length > 0 || isSnapshotLoading) && (
          <Grid size={12}>
            <StyledTableContainer>
              <Table aria-label="simple table">
                <StyledTableHead>
                  <TableRow>
                    <StyledHeaderCell>快照名称</StyledHeaderCell>
                    <StyledHeaderCell align="center">创建时间</StyledHeaderCell>
                    <StyledHeaderCell align="center">大小</StyledHeaderCell>
                    <StyledHeaderCell align="center">操作</StyledHeaderCell>
                  </TableRow>
                </StyledTableHead>
                <StyledTableBody>
                  {tableRows}

                  {isSnapshotLoading && (
                    <StyledTableRow>
                      <TableCell colSpan={4} align="center">
                        加载中...
                      </TableCell>
                    </StyledTableRow>
                  )}
                </StyledTableBody>
              </Table>
            </StyledTableContainer>
          </Grid>
        )}
        {!isLoading && !snapshots?.length && !isSnapshotLoading && (
          <Grid textAlign={'center'} size={12}>
            <Typography>暂无快照，立即拍摄！ 📸</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

// props validation
SnapshotsTab.propTypes = {
  collectionName: PropTypes.string.isRequired,
};
