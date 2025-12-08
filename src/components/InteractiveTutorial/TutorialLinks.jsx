import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography } from '@mui/material';
import InfoCard from '../Common/InfoCard/InfoCard';
import { Filter, SlidersHorizontal, ScanText, VectorSquare, Grip, SearchCode, Network } from 'lucide-react';

const TUTORIAL_SECTIONS = {
  vectorSearch: {
    title: '向量搜索',
    tutorials: [
      {
        icon: Filter,
        title: '过滤 - 入门',
        description: '使用基本的负载条件过滤搜索结果。',
        href: '/tutorial/filteringbeginner',
      },
      {
        icon: SlidersHorizontal,
        title: '过滤 - 高级',
        description: '尝试基于嵌套负载条件的高级过滤。',
        href: '/tutorial/filteringadvanced',
      },
      {
        icon: ScanText,
        title: '过滤 - 全文',
        description: '在文本字段中搜索子字符串、令牌或短语。',
        href: '/tutorial/filteringfulltext',
      },
      {
        icon: VectorSquare,
        title: '多向量搜索',
        description: '处理由 ColBERT 多向量表示的数据。',
        href: '/tutorial/multivectors',
      },
      {
        icon: Grip,
        title: '稀疏向量搜索',
        description: '使用稀疏向量获取特定的搜索结果。',
        href: '/tutorial/sparsevectors',
      },
      {
        icon: SearchCode,
        title: '混合搜索',
        description: '结合密集和稀疏向量以获得更准确的搜索结果。',
        href: '/tutorial/hybridsearch',
      },
    ],
  },
  multitenancy: {
    title: '设置指南',
    tutorials: [
      {
        icon: Network,
        title: '多租户',
        description: '在单个集合中管理多个用户。',
        href: '/tutorial/multitenancy',
      },
    ],
  },
};

const TutorialLinks = ({ sections = ['filtering', 'vectorSearch', 'multitenancy'], showTitle = true }) => {
  const allTutorials = sections.reduce((acc, sectionKey) => {
    const section = TUTORIAL_SECTIONS[sectionKey];
    if (section) {
      return [...acc, ...section.tutorials];
    }
    return acc;
  }, []);

  if (showTitle) {
    return (
      <>
        {sections.map((sectionKey) => {
          const section = TUTORIAL_SECTIONS[sectionKey];
          if (!section) return null;

          return (
            <Box key={sectionKey} component="section">
              <Typography component="h2" variant="h6" mb="1rem">
                {section.title}
              </Typography>
              <Grid container spacing={2} sx={{ '& > .MuiGrid-root': { display: 'flex' } }}>
                {section.tutorials.map((tutorial) => (
                  <Grid key={tutorial.href} size={{ xs: 12, md: 6, lg: 3 }}>
                    <InfoCard
                      icon={tutorial.icon}
                      iconVariant="top"
                      title={tutorial.title}
                      description={tutorial.description}
                      href={tutorial.href}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
      </>
    );
  }

  return (
    <Grid container spacing={2} sx={{ '& > .MuiGrid-root': { display: 'flex' } }}>
      {allTutorials.map((tutorial) => (
        <Grid key={tutorial.href} size={{ xs: 12, md: 6, lg: 3 }}>
          <InfoCard
            icon={tutorial.icon}
            iconVariant="top"
            title={tutorial.title}
            description={tutorial.description}
            href={tutorial.href}
          />
        </Grid>
      ))}
    </Grid>
  );
};

TutorialLinks.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string),
  showTitle: PropTypes.bool,
};

export default TutorialLinks;
