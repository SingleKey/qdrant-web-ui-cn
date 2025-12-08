import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, LinearProgress, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Vectors from './PointVectors';
import PointPayload from './PointPayload';
import { CopyButton } from '../Common/CopyButton';
import { Trash } from 'lucide-react';
import ConfirmationDialog from '../Common/ConfirmationDialog';
import { bigIntJSON } from '../../common/bigIntJSON';
import { Divider } from '@mui/material';

const PointCard = (props) => {
  const { onConditionChange /* , conditions */ } = props;
  const [point, setPoint] = React.useState(props.point);
  const [loading, setLoading] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const onPayloadEdit = (payload) => {
    setPoint({ ...point, payload: structuredClone(payload) });
  };

  const deletePoint = async () => {
    setLoading(true);
    props.deletePoint(props.collectionName, [point.id]).then(() => {
      setPoint(null);
      setLoading(false);
    });
  };

  if (!point) {
    return null;
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
        }}
        role="listitem"
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
            }}
          >
            <LinearProgress />
          </Box>
        )}
        <CardHeader
          title={'Point ' + point.id}
          variant="heading"
          aria-label="Point Card Header"
          action={
            <>
              <CopyButton
                text={bigIntJSON.stringify(point)}
                tooltip={'复制点到剪贴板'}
                successMessage={'点JSON已复制到剪贴板'}
              />
              <Tooltip title={'删除点'} placement={'left'}>
                <IconButton
                  aria-label={'删除点'}
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  <Trash size={'1.25rem'} />
                </IconButton>
              </Tooltip>
            </>
          }
        />
        {Object.keys(point.payload).length > 0 && (
          <>
            <CardContent sx={{ padding: '0.5rem 1rem' }}>
              <PointPayload point={point} onPayloadEdit={onPayloadEdit} setLoading={setLoading} />
            </CardContent>
          </>
        )}
        <Divider />
        <CardContent sx={{ padding: '1rem' }}>
          {point?.vector && <Vectors point={point} onConditionChange={onConditionChange} />}
        </CardContent>
      </Card>
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title={'删除点 ' + point.id}
        content={`您确定要删除ID为 ${point.id} 的点吗？`}
        warning={`此操作无法撤销。`}
        actionName={'删除'}
        actionHandler={() => deletePoint()}
        aria-label="删除点确认对话框"
      />
    </>
  );
};

PointCard.propTypes = {
  point: PropTypes.object.isRequired,
  onConditionChange: PropTypes.func.isRequired,
  conditions: PropTypes.array.isRequired,
  collectionName: PropTypes.string.isRequired, // use params instead?
  deletePoint: PropTypes.func.isRequired,
  payloadSchema: PropTypes.object.isRequired,
  client: PropTypes.object,
};

export default PointCard;
