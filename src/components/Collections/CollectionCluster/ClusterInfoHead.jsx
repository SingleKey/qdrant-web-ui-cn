import { TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';

const ClusterInfoHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle1" fontWeight={600}>
            分片ID
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight={600}>
            位置
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1" fontWeight={600}>
            状态
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default ClusterInfoHead;
