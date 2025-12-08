import React, { useState } from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';
import AnnouncementBanner from '../components/Common/AnnouncementBanner';
import CardBanner from '../components/Common/CardBanner';
import InfoCard from '../components/Common/InfoCard/InfoCard';
import TutorialLinks from '../components/InteractiveTutorial/TutorialLinks';
import { Workflow, FileCode } from 'lucide-react';
import { useExternalInfo } from '../context/external-info-context';
import { getFullPath } from '../lib/common-helpers';

const Welcome = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { banner } = useExternalInfo();

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  const displayBannerContent = () => {
    if (!banner || !showBanner) {
      return null;
    }

    return (
      <AnnouncementBanner show={showBanner} onClose={handleCloseBanner}>
        <Typography>
          {banner.message} &nbsp;
          {banner.link && (
            <Link target="_blank" href={banner.link}>
              {banner.link_text}
            </Link>
          )}
        </Typography>
      </AnnouncementBanner>
    );
  };

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
      {displayBannerContent()}

      <Box component="header">
        <Typography
          component="h1"
          variant="h4"
          sx={{
            color: 'text.primary',
            fontFeatureSettings: "'ss01' on, 'ss05' on, 'ss06' on, 'liga' off, 'clig' off",
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

        <CardBanner
          title="开始使用 Qdrant 中的向量搜索"
          description="通过创建集合并插入向量来开始构建您的应用。"
          buttonText="查看快速开始"
          linkTo="/tutorial/quickstart"
          imgSrc={getFullPath('/assets/console.svg')}
        />
      </Box>

      <Box component="section">
        <Typography component="h2" variant="h6" mb="1rem">
          连接到您的项目或从示例开始
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={Workflow}
              title="API 参考"
              description={
                "探索 Qdrant 的 REST API 和 SDK，轻松连接、查询和管理您的向量数据。"
              }
              href="https://api.qdrant.tech/"
              showCta={false}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoCard
              icon={FileCode}
              title="加载示例数据"
              description={`按照本教程导入远程快照，只需几步即可使用真实数据探索向量搜索。`}
              href="/datasets"
              showCta={false}
            />
          </Grid>
        </Grid>
      </Box>

      <Box component="section">
        <Typography component="h2" variant="h6" mb="1rem">
          交互式教程
        </Typography>
        <TutorialLinks sections={['vectorSearch', 'multitenancy']} showTitle={false} />
      </Box>
    </Box>
  );
};

export default Welcome;
