import React from 'react';
import InteractiveTutorial from '../components/InteractiveTutorial/InteractiveTutorial';
import { CenteredFrame } from '../components/Common/CenteredFrame';
import { useParams } from 'react-router-dom';
import { Alert, Box, Grid } from '@mui/material';
import { useClient } from '../context/client-context';

export const Tutorial = () => {
  const { pageSlug } = useParams();
  const { isRestricted } = useClient();

  if (isRestricted) {
    return (
      <Box sx={{ p: 5, width: '100%' }}>
        <Grid size={12}>
          <Alert severity="warning">
            访问被拒绝：由于服务器less模式，教程在这里无法正常工作。请联系您的管理员。
          </Alert>
        </Grid>
      </Box>
    );
  }
  return (
    <CenteredFrame>
      <InteractiveTutorial pageSlug={pageSlug} />
    </CenteredFrame>
  );
};

export default Tutorial;
