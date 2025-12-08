import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { alpha, Paper, Box, Tooltip, Typography, Grid, IconButton, Tabs, Tab } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import GraphVisualisation from '../components/GraphVisualisation/GraphVisualisation';
import { useWindowResize } from '../hooks/windowHooks';
import PointPreview from '../components/Common/PointPreview';
import TabPanel from '../components/Common/TabPanel';
import CodeEditorWindow from '../components/FilterEditorWindow';
import { useClient } from '../context/client-context';
import { getFirstPoint, getSamplePoints } from '../lib/graph-visualization-helpers';
import { useSnackbar } from 'notistack';

const explanation = `

// 扩展请求参数：
//
// 可用参数：
//
// - 'limit': 每步使用的记录数。
// - 'sample': 使用集合中的样本数据引导图。
//
// - 'filter': 用于选择要可视化的向量的过滤表达式。
//             参见 https://qdrant.tech/documentation/concepts/filtering/
//
// - 'using': 如果有多个向量，指定要使用哪个向量进行可视化。
//
// - 'tree': 如果为true，将显示生成树而不是完整图。

`;

const defaultJson = `
// 试试我！

{
  "limit": 5
}
`;

const defaultQuery = defaultJson + explanation;

function Graph() {
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { newInitNode, vectorName } = location.state || {};
  const [initNode, setInitNode] = useState(null);
  const [sampleLinks, setSampleLinks] = useState(null);

  const [options, setOptions] = useState({
    limit: 5,
    filter: null,
    using: null,
    collectionName: params.collectionName,
  });
  const [visualizeChartHeight, setVisualizeChartHeight] = useState(0);
  const VisualizeChartWrapper = useRef(null);
  const { height } = useWindowResize();
  const { enqueueSnackbar } = useSnackbar();
  const { client: qdrantClient } = useClient();

  const [code, setCode] = useState(defaultQuery);

  const [activePoint, setActivePoint] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setVisualizeChartHeight(height - VisualizeChartWrapper.current?.offsetTop);
  }, [height, VisualizeChartWrapper]);

  const handlePointDisplay = useCallback((point) => {
    setActivePoint(point);
  }, []);

  useEffect(() => {
    if (newInitNode) {
      delete newInitNode.vector;
      setInitNode(newInitNode);

      const option = vectorName
        ? {
            limit: 5,
            using: vectorName,
          }
        : {
            limit: 5,
          };
      setCode(JSON.stringify(option, null, 2) + explanation);

      option.collectionName = params.collectionName;
      setOptions(option);
    }
  }, [newInitNode, vectorName]);

  const handleRunCode = async (data, collectionName) => {
    // scroll
    try {
      if (data.sample) {
        const sampleLinks = await getSamplePoints(qdrantClient, {
          collectionName: collectionName,
          ...data,
        });
        setSampleLinks(sampleLinks);
        setInitNode(null);
      } else {
        const firstPoint = await getFirstPoint(qdrantClient, { collectionName: collectionName, filter: data?.filter });
        setInitNode(firstPoint);
      }
      setOptions({
        collectionName: collectionName,
        ...data,
      });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };

  const queryRequestSchema = (vectorNames) => ({
    description: '过滤请求',
    type: 'object',
    properties: {
      limit: {
        description: '页面大小。默认值：10',
        type: 'integer',
        format: 'uint',
        minimum: 1,
        nullable: true,
      },
      filter: {
        description: '只查找满足此条件的点。如果未提供 - 所有点。',
        anyOf: [
          {
            $ref: '#/components/schemas/Filter',
          },
          {
            nullable: true,
          },
        ],
      },
      using: {
        description: '向量字段名称',
        type: 'string',
        enum: vectorNames,
      },
      sample: {
        description: '使用集合中的样本数据引导图',
        type: 'integer',
        nullable: true,
      },
      tree: {
        description: '显示生成树而不是完整图',
        type: 'boolean',
        nullable: true,
      },
    },
  });

  useEffect(() => {
    if (activePoint != null && tabValue !== 1) {
      setTabValue(1);
    }
  }, [activePoint]);

  return (
    <>
      <Box component="main">
        <Grid container>
          <Grid size={12}>
            <PanelGroup direction="horizontal" autoSaveId="persistence">
              <Panel defaultSize={50}>
                <Box width={'100%'}>
                  <Box>
                    <Paper
                      variant="heading"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 0,
                      }}
                    >
                      <Tooltip title={'返回集合'}>
                        <IconButton
                          sx={{ mr: 3 }}
                          size="small"
                          onClick={() => navigate(`/collections/${params.collectionName}`)}
                        >
                          <ArrowBack />
                        </IconButton>
                      </Tooltip>
                      <Typography variant="h6">{params.collectionName}</Typography>
                    </Paper>
                  </Box>

                  <Box ref={VisualizeChartWrapper} height={visualizeChartHeight} width={'100%'}>
                    <GraphVisualisation
                      options={options}
                      initNode={initNode}
                      onDataDisplay={handlePointDisplay}
                      wrapperRef={VisualizeChartWrapper.current}
                      sampleLinks={sampleLinks}
                    />
                  </Box>
                </Box>
              </Panel>
              <PanelResizeHandle
                style={{
                  width: '10px',
                  background: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  &#8942;
                </Box>
              </PanelResizeHandle>
              <Panel>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="图可视化标签">
                      <Tab label="代码" />
                      <Tab label="数据面板" />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0} style={{ flex: 1, overflow: 'hidden' }}>
                    <CodeEditorWindow
                      code={code}
                      onChange={setCode}
                      onChangeResult={handleRunCode}
                      customRequestSchema={queryRequestSchema}
                    />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1} style={{ flex: 1, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', overflowY: 'scroll' }}>
                      <PointPreview point={activePoint} />
                    </Box>
                  </TabPanel>
                </Box>
              </Panel>
            </PanelGroup>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default Graph;
