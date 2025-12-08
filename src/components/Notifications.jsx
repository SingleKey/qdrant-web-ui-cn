import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Bell } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import List from '@mui/material/List';
import MuiListItem from '@mui/material/ListItem';
import MuiDivider from '@mui/material/Divider';
import { axiosInstance as axios } from '../common/axios';
import { CodeBlock } from './Common/CodeBlock/CodeBlock';
import { Box, Button, Chip, Drawer, useMediaQuery } from '@mui/material';
import { requestFromCode } from './CodeEditorWindow/config/RequesFromCode';
import { bigIntJSON } from '../common/bigIntJSON';
import PropTypes from 'prop-types';
import { Close } from '@mui/icons-material';

async function fetchNotifications() {
  try {
    const issues = await axios.get('/issues');
    return issues.data.result.issues;
  } catch (error) {
    console.log('error', error);
  }
}

async function deleteNotifications() {
  try {
    const res = await axios.delete('/issues');
    return res.data;
  } catch (error) {
    console.log('error', error);
    return error;
  }
}

const ListItem = styled(MuiListItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  background: alpha(theme.palette.info.main, 0.05),
  borderColor: `${theme.palette.info.main} !important`,
  borderRadius: '5px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Loading = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: theme.spacing(3, 0),
}));

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

export default function Notifications() {
  const [open, setOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [issues, setIssues] = React.useState([]);
  const [issuesCount, setIssuesCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const matchesMdMedia = useMediaQuery('(max-width: 992px)');

  React.useEffect(() => {
    setLoading(true);
    fetchNotifications().then((data) => {
      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }
      setIssuesCount(data.length);
      setIssues(data);
      setLoading(false);
    });
  }, []);

  const handleToggle = () => {
    if (open) {
      fetchNotifications().then((data) => {
        setIssues(data);
        setLoading(false);
      });
    }
    if (issuesCount > 0) {
      setIssuesCount(0);
    }
    setOpen((prevOpen) => !prevOpen);
    setTooltipOpen(false);
  };

  const handleDeleteAll = () => {
    setLoading(true);
    deleteNotifications().then(() => {
      fetchNotifications().then((data) => {
        setIssues(data);
        setLoading(false);
      });
    });
  };

  return (
    <React.Fragment>
      <Tooltip
        open={tooltipOpen}
        title="切换通知"
        enterDelay={300}
        onOpen={() => {
          setTooltipOpen(!open);
        }}
        onClose={() => {
          setTooltipOpen(false);
        }}
      >
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'notifications-popup' : undefined}
          aria-haspopup="true"
          aria-label="未读通知"
          data-ga-event-category="AppBar"
          data-ga-event-action="toggleNotifications"
          onClick={handleToggle}
          size="large"
        >
          <Badge color="error" badgeContent={issuesCount}>
            <Bell size={20} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Drawer
        anchor={'right'}
        open={open}
        onClose={handleToggle}
        sx={{
          '& .MuiDrawer-paper': {
            minWidth: matchesMdMedia ? '100vw' : '680px',
            width: matchesMdMedia ? '100vw' : '55vw',
            padding: '1rem',
            pt: '6rem',
          },
          '& .MuiBackdrop-root.MuiModal-backdrop': {
            opacity: '0 !important',
          },
        }}
      >
        <div>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mr: 2 }}>
            <Typography variant={'h5'}>通知</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={handleToggle}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mr: 2 }}>
            <Typography variant={'body1'}>检测到配置问题</Typography>
            <Box sx={{ flexGrow: 1 }} />
            {issues.length > 0 && (
              <Button color="error" variant="contained" onClick={handleDeleteAll}>
                删除所有问题
              </Button>
            )}
          </Box>

          <List>
            {!loading ? (
              issues.length > 0 ? (
                issues.map((issue) => (
                  <React.Fragment key={issue.id}>
                    <Notification issue={issue} />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <Typography color="text.secondary">没有通知（问题）</Typography>
                </ListItem>
              )
            ) : (
              <Loading>
                <CircularProgress size={32} />
              </Loading>
            )}
          </List>
        </div>
      </Drawer>
    </React.Fragment>
  );
}

function Notification({ issue }) {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleRun = (code) => {
    setLoading(true);
    requestFromCode(code, false)
      .then((res) => {
        setResult(() => bigIntJSON.stringify(res, null, 2));
        setLoading(false);
      })
      .catch((err) => {
        setError(() => bigIntJSON.stringify(err, null, 2));
        setLoading(false);
      });
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={
        result
          ? {
              background: 'rgba(0, 255, 0, 0.1)',
              borderColor: 'rgba(0, 255, 0, 0.5) !important',
            }
          : error
          ? {
              background: 'rgba(255, 0, 0, 0.1)',
              borderColor: 'rgba(255, 0, 0, 0.5) !important',
            }
          : null
      }
    >
      {loading ? (
        <CircularProgress size={32} />
      ) : result ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleOutlineIcon color="success" />
              <Typography color="success" variant="body1">
                <b>成功！索引已成功确认。</b>
              </Typography>
            </Box>
      ) : (
        <React.Fragment>
          {error ? (
            <Box>
              <Typography color="error" variant="body1">
                <b>错误</b>
              </Typography>
              <CodeBlock
                codeStr={error.toString()}
                language="json"
                withRunButton={false}
                title="Error"
                editable={false}
              />
            </Box>
          ) : null}
          <Typography
            component={'span'}
            variant={'caption'}
            sx={(theme) => ({
              display: 'inline-block',
              color: theme.palette.info.main,
              border: `1px solid ${theme.palette.info.main}`,
              px: 0.5,
              borderRadius: '5px',
              my: 0.5,
            })}
          >
            #{issue.id}
          </Typography>
          <Typography gutterBottom>
            <b>{issue.description}</b>
          </Typography>

          {issue.solution && issue.solution.immediate && (
            <React.Fragment>
              <Typography gutterBottom variant="body2" color="text.secondary">
                <span
                  id="notification-message"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: issue.solution.immediate.message }}
                />
              </Typography>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <CodeBlock
                  codeStr={`${issue.solution.immediate.action.method} ${issue.solution.immediate.action.uri}
${JSON.stringify(issue.solution.immediate.action.body, null, 2)}`}
                  language="json"
                  withRunButton={true}
                  onRun={handleRun}
                  title="解决方案"
                  editable={false}
                />
              </Box>
            </React.Fragment>
          )}
          {issue.solution && issue.solution.immediate_choice && (
            <React.Fragment>
              <Typography gutterBottom variant="body" color="text.secondary">
                选择以下解决方案之一：
              </Typography>
              {issue.solution.immediate_choice.map((choice, index) => (
                <React.Fragment key={index}>
                  <Typography gutterBottom variant="body2" color="text.secondary">
                    <span
                      id="notification-message"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: choice.message }}
                    />
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                    }}
                  >
                    <CodeBlock
                      codeStr={`${choice.action.method} ${choice.action.uri}
${JSON.stringify(choice.action.body, null, 2)}`}
                      language="json"
                      withRunButton={true}
                      onRun={handleRun}
                      title="解决方案"
                      editable={false}
                    />
                  </Box>
                  {index < issue.solution.immediate_choice.length - 1 ? (
                    <Divider sx={{ width: '100%' }}>
                      <Chip label="或" size="small" />
                    </Divider>
                  ) : null}
                </React.Fragment>
              ))}
            </React.Fragment>
          )}

          {issue.timestamp && (
            <Typography variant="caption" color="text.secondary">
              {new Date(issue.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          )}
        </React.Fragment>
      )}
    </ListItem>
  );
}

Notification.propTypes = {
  issue: PropTypes.any,
};
