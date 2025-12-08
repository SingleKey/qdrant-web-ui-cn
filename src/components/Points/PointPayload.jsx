import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { CopyButton } from '../Common/CopyButton';
import { Pencil } from 'lucide-react';
import JsonViewerCustom from '../Common/JsonViewerCustom';
import { bigIntJSON } from '../../common/bigIntJSON';
import PointImage from './PointImage';
import { PayloadEditor } from './PayloadEditor';

const PointPayload = ({ point, showImage = true, onPayloadEdit, setLoading, buttonsToShow = ['copy', 'edit'] }) => {
  const [openPayloadEditor, setOpenPayloadEditor] = useState(false);

  if (!point || !point.payload || Object.keys(point.payload).length === 0) {
    return null;
  }

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} aria-label="点负载">
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2" marginRight={'24px'}>
              负载
            </Typography>
            {buttonsToShow.includes('copy') && (
              <CopyButton
                text={bigIntJSON.stringify(point.payload)}
                tooltip={'复制负载到剪贴板'}
                successMessage={'负载JSON已复制到剪贴板'}
              />
            )}
            {buttonsToShow.includes('edit') && (
              <Tooltip title={'编辑负载'} placement={'left'}>
                <IconButton
                  aria-label="编辑负载"
                  onClick={() => setOpenPayloadEditor(true)}
                  sx={{ color: 'text.primary' }}
                >
                  <Pencil size={'1.25rem'} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <JsonViewerCustom
            value={point.payload}
            displayDataTypes={false}
            defaultInspectDepth={2}
            displayObjectSize={false}
            rootName={false}
            enableClipboard={false}
          />
        </Box>
        {showImage && point.payload && <PointImage data={point.payload} />}
      </Box>
      <PayloadEditor
        point={point}
        open={openPayloadEditor}
        onClose={() => setOpenPayloadEditor(false)}
        onSave={onPayloadEdit}
        setLoading={setLoading || (() => {})}
        aria-label="负载编辑器"
      />
    </>
  );
};

PointPayload.propTypes = {
  point: PropTypes.object.isRequired,
  showImage: PropTypes.bool,
  onPayloadEdit: PropTypes.func.isRequired,
  setLoading: PropTypes.func,
  buttonsToShow: PropTypes.array,
};

export default PointPayload;
