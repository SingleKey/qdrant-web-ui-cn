import React from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { useClient } from '../context/client-context';
import InfoCard from '../components/Common/InfoCard/InfoCard';
import TutorialLinks from '../components/InteractiveTutorial/TutorialLinks';
import { Zap, FileCode } from 'lucide-react';

export const TutorialIndex = () => {
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
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
        p: 5,
        margin: 'auto',
        maxWidth: '1120px',
      }}
    >
      <Box component="header">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            color: 'text.primary',
            fontSize: '2rem',
            fontStyle: 'normal',
            fontWeight: '600',
            lineHeight: '125%',
            letterSpacing: '-0.5px',
            mb: '1rem',
          }}
        >
          欢迎使用 Qdrant！
        </Typography>
      </Box>

      <Box component="section">
        <Typography component="h2" variant="h6" mb="1rem">
          连接到您的项目或从示例开始
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={Zap}
              title="快速开始"
              description={'创建集合、上传向量并运行搜索。'}
              href="/tutorial/quickstart"
              showCta={false}
              sx={{ flexGrow: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={FileCode}
              title="加载示例数据"
              description={`按照本教程导入远程快照，只需几步即可使用真实数据探索向量搜索。`}
              href="/datasets"
              showCta={false}
              sx={{ flexGrow: 1 }}
            />
          </Grid>
        </Grid>
      </Box>

      <TutorialLinks sections={['filtering', 'vectorSearch', 'multitenancy']} />
    </Box>
  );
};

export default TutorialIndex;
