import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Box, Tooltip, Typography, Grid, IconButton, Tabs, Tab } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import FilterEditorWindow from '../components/FilterEditorWindow';
import VisualizeChart from '../components/VisualizeChart';
import { useWindowResize } from '../hooks/windowHooks';
import PointPreview from '../components/Common/PointPreview';
import TabPanel from '../components/Common/TabPanel';
import { useClient } from '../context/client-context';
import { requestData } from '../components/VisualizeChart/requestData';
import { useSnackbar } from 'notistack';

const query = `

// 试试看！

{
  "limit": 500
}

// 指定请求参数以选择要可视化的数据。
//
// 可用参数：
//
// - 'limit': 要可视化的向量的最大数量。
//            *警告*: 较大的值可能导致浏览器冻结。
//
// - 'filter': 用于选择要可视化的向量的过滤表达式。
//             请参阅 https://qdrant.tech/documentation/concepts/filtering/
//
// - 'color_by': 指定用于为点着色的分数或负载字段。
//               使用方法：
//
//                "color_by": {
//                  "payload": "field_name"
//                }
//
// - 'using': 如果有多个向量，指定要用于可视化的向量。
//
// - 'algorithm': 指定用于可视化的算法。可用选项: 'TSNE', 'UMAP', 'PCA'.


`;
const defaultResult = {};

function Visualize() {
  const theme = useTheme();
  const { client: qdrantClient } = useClient();
  const [code, setCode] = useState(query);

  // Contains the raw output of the request of QdrantClient
  const [result, setResult] = useState(defaultResult);
  const [visualizationParams, setVisualizationParams] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  // const [errorMessage, setErrorMessage] = useState(null); // todo: use or remove
  const navigate = useNavigate();
  const params = useParams();
  const [visualizeChartHeight, setVisualizeChartHeight] = useState(0);
  const VisualizeChartWrapper = useRef(null);
  const { height } = useWindowResize();
  const [activePoint, setActivePoint] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setVisualizeChartHeight(height - VisualizeChartWrapper.current?.offsetTop);
  }, [height, VisualizeChartWrapper]);

  useEffect(() => {
    if (activePoint != null && tabValue !== 1) {
      setTabValue(1);
    }
  }, [activePoint]);

  const onEditorCodeRun = async (data, collectionName) => {
    setVisualizationParams(data);

    try {
      const result = await requestData(qdrantClient, collectionName, data);
      setResult(result);
    } catch (e) {
      enqueueSnackbar(`Request error: ${e.message}`, { variant: 'error' });
    }
  };

  const filterRequestSchema = (vectorNames) => ({
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
        description: '指定要用于可视化的向量',
        type: 'string',
        enum: vectorNames,
      },
      color_by: {
        description: '按此字段为点着色',
        anyOf: [
          {
            type: 'string', // 用于着色的字段名称
          },
          {
            description: '字段名称',
            type: 'object',
            properties: {
              payload: {
                description: '用于着色的字段名称',
                type: 'string',
              },
            },
          },
          {
            description: '查询',
            type: 'object',
            properties: {
              query: {
                $ref: '#/components/schemas/QueryInterface',
              },
            },
          },
          {
            nullable: true,
          },
        ],
      },
      algorithm: {
        description: '用于可视化的算法',
        type: 'string',
        enum: ['TSNE', 'UMAP', 'PCA'],
        default: 'TSNE',
      },
    },
  });

  return (
    <>
      <Box component="main">
        {/* {errorMessage !== null && <ErrorNotifier {...{message: errorMessage}} />} */}
        <Grid container>
          {/*  {errorMessage && (*/}
          {/*    <Grid xs={12} item textAlign={'center'}>*/}
          {/*      <Typography>⚠ Error: {errorMessage}</Typography>*/}
          {/*    </Grid>*/}
          {/*  )}*/}
          <Grid size={12}>
            <PanelGroup direction="horizontal">
              <Panel style={{ display: 'flex' }}>
                <Box width={'100%'}>
                  <Box>
                    <Paper
                      variant="heading"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 0,
                        borderBottom: `1px solid ${theme.palette.divider}`,
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
                    <VisualizeChart
                      requestResult={result}
                      visualizationParams={visualizationParams}
                      activePoint={activePoint}
                      setActivePoint={setActivePoint}
                    />
                  </Box>
                </Box>
              </Panel>
              <PanelResizeHandle
                style={{
                  width: '10px',
                  background: theme.palette.background.paperElevation2,
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
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="可视化标签页">
                      <Tab label="代码" />
                      <Tab label="数据面板" />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0} style={{ flex: 1, overflow: 'hidden' }}>
                    <FilterEditorWindow
                      code={code}
                      onChange={setCode}
                      onChangeResult={onEditorCodeRun}
                      customRequestSchema={filterRequestSchema}
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

export default Visualize;
