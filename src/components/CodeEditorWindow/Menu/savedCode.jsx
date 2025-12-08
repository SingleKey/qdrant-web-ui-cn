import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SwipeableDrawer, Button, Box, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditorCommon from '../../EditorCommon';
import { bigIntJSON } from '../../../common/bigIntJSON';

function SavedCode({ state, code, handleEditorChange, toggleDrawer }) {
  const [viewCode, setViewCode] = React.useState(`//Current Editor Code: \n${code}`);
  const [saveNameText, setSaveNameText] = useState('');
  const [savedCodes, setSavedCodes] = useState(
    localStorage.getItem('savedCodes') ? bigIntJSON.parse(localStorage.getItem('savedCodes')) : []
  );

  useEffect(() => {
    setSavedCodes(localStorage.getItem('savedCodes') ? bigIntJSON.parse(localStorage.getItem('savedCodes')) : []);
    setViewCode(`//Current Editor Code: \n${code}`);
  }, [state]);

  function saveCode() {
    if (saveNameText !== '') {
      const data = [
        ...savedCodes,
        {
          idx: saveNameText + Date.now(), // unique id to prevent duplicate
          name: saveNameText,
          code: code,
          time: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
        },
      ];
      localStorage.setItem('savedCodes', bigIntJSON.stringify(data));
      setSavedCodes(bigIntJSON.parse(localStorage.getItem('savedCodes')));
      setSaveNameText('');
    }
  }

  const columns = [
    {
      field: 'name',
      headerName: '名称',
      minWidth: 100,
      valueGetter: (r, v) => v.name,
      flex: 1,
    },
    {
      field: 'time',
      headerName: '时间',
      width: 100,
      valueGetter: (r, v) => v.time,
    },
    {
      field: 'date',
      headerName: '日期',
      width: 100,
      valueGetter: (r, v) => v.date,
    },
    {
      field: 'delete',
      headerName: '删除',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (r) => deleteIcon(r.row),
    },
  ];
  function deleteIcon(data) {
    return (
      <Button
        color="error"
        onClick={() => {
          const index = savedCodes.indexOf(data);
          const updateCode = [...savedCodes];
          updateCode.splice(index, 1);
          localStorage.setItem('savedCodes', bigIntJSON.stringify(updateCode));
          setSavedCodes(bigIntJSON.parse(localStorage.getItem('savedCodes')));
        }}
      >
        <DeleteIcon />
      </Button>
    );
  }
  return (
    <React.Fragment key={'SavedCode'}>
      <SwipeableDrawer anchor="top" open={state} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            mt: 8,
          }}
        >
          <Box
            sx={{
              width: '60%',
            }}
          >
            <Typography variant="h5" m={2} gutterBottom>
              已保存代码
            </Typography>
            <Stack direction="row" spacing={2} m={2}>
              <TextField
                placeholder=" 名称 (必填)*"
                variant="standard"
                value={saveNameText}
                onChange={(e) => {
                  setSaveNameText(e.target.value);
                }}
              />
              <Button onClick={saveCode}>保存</Button>
            </Stack>
            {savedCodes.length === 0 && (
              <Stack direction="row" spacing={2}>
                <Typography variant="h6" m={2} gutterBottom>
                  未找到保存的代码
                </Typography>
              </Stack>
            )}
            <Stack direction="column" justifyContent="center" alignItems="stretch" spacing={2} m={2}>
              {savedCodes.length > 0 && (
                <div style={{ height: '375px', width: '100%' }}>
                  <DataGrid
                    sx={{
                      '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                        outline: 'none !important',
                      },
                      '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
                        outline: 'none !important',
                      },
                    }}
                    rows={savedCodes}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    rowsPerPageOptions={[5, 10]}
                    getRowId={(row) => `${row.time} ${row.date}`}
                    onRowClick={(params) => {
                      setViewCode(params.row.code);
                    }}
                  />
                </div>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              width: '40%',
            }}
            m={2}
          >
            <EditorCommon
              height="475px"
              value={viewCode}
              options={{
                scrollBeyondLastLine: false,
                fontSize: 12,
                wordWrap: 'on',
                minimap: { enabled: false },
                automaticLayout: true,
                readOnly: true,
                mouseWheelZoom: true,
              }}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                key={'apply'}
                variant="outlined"
                color="success"
                onClick={() => {
                  handleEditorChange('code', `${viewCode} 
${code}`);
                  toggleDrawer();
                }}
              >
                应用代码
              </Button>
              <Button key={'close'} variant="outlined" color="error" onClick={toggleDrawer}>
                关闭
              </Button>
            </Stack>
          </Box>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
}

SavedCode.propTypes = {
  state: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func,
  handleEditorChange: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
};

export default memo(SavedCode);
