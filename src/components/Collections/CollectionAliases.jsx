import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Tooltip,
  Table,
  TableCell,
  TableRow,
  useTheme,
  alpha,
} from '@mui/material';
import { Trash } from 'lucide-react';
import ConfirmationDialog from '../Common/ConfirmationDialog';
import { getSnackbarOptions } from '../Common/utils/snackbarOptions';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { useClient } from '../../context/client-context';
import { StyledTableContainer, StyledTableHead, StyledTableBody, StyledTableRow } from '../Common/StyledTable';

const CollectionAliases = ({ collectionName }) => {
  const { client: qdrantClient } = useClient();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [aliasToDelete, setAliasToDelete] = useState('');
  const [aliases, setAliases] = useState([]);
  const theme = useTheme();

  // Fetch aliases on mount
  useEffect(() => {
    const fetchAliases = async () => {
      try {
        const res = await qdrantClient.getCollectionAliases(collectionName);
        setAliases(res.aliases || []);
      } catch (err) {
        enqueueSnackbar(err.message, getSnackbarOptions('error', closeSnackbar));
      }
    };
    fetchAliases().catch((e) => console.error(e));
  }, [collectionName, qdrantClient]);

  // Delete alias handler
  const deleteAlias = useCallback(
    async (aliasName) => {
      try {
        await qdrantClient.updateCollectionAliases({
          actions: [{ delete_alias: { alias_name: aliasName } }],
        });
        setAliases((prev) => prev.filter((alias) => alias.alias_name !== aliasName));
        enqueueSnackbar('Alias deleted successfully', getSnackbarOptions('success', closeSnackbar, 2000));
      } catch (err) {
        enqueueSnackbar(err.message, getSnackbarOptions('error', closeSnackbar));
      }
    },
    [qdrantClient]
  );

  // Create alias handler
  const handleCreateAlias = useCallback(
    async (newAliasName) => {
      const newAliasNameNormalized = newAliasName.trim();

      // if alias name already exists
      if (aliases.some((alias) => alias.alias_name === newAliasNameNormalized)) {
        enqueueSnackbar('Alias name already exists', getSnackbarOptions('error', closeSnackbar, 2000));
        setOpenCreateModal(false);
        return;
      }
      // if alias name is empty
      if (!newAliasNameNormalized) {
        enqueueSnackbar('Alias name cannot be empty', getSnackbarOptions('error', closeSnackbar, 2000));
        return;
      }

      try {
        await qdrantClient.updateCollectionAliases({
          actions: [{ create_alias: { collection_name: collectionName, alias_name: newAliasNameNormalized } }],
        });
        setAliases((prev) => [...prev, { alias_name: newAliasNameNormalized }]);
        setOpenCreateModal(false);
        enqueueSnackbar('Alias created successfully', getSnackbarOptions('success', closeSnackbar, 2000));
      } catch (err) {
        enqueueSnackbar(err.message, getSnackbarOptions('error', closeSnackbar));
      }
    },
    [collectionName, qdrantClient, aliases]
  );

  const AliasList = aliases.map((alias) => (
    <AliasRow key={alias.alias_name} aliasName={alias.alias_name} onDelete={() => setAliasToDelete(alias.alias_name)} />
  ));

  return (
    <StyledTableContainer sx={{ mb: 5 }}>
      <Table aria-label="aliases table">
        <StyledTableHead sx={{ background: theme.palette.background.paperElevation1, borderBottom: 0 }}>
          <TableRow sx={{ background: alpha(theme.palette.action.hover, 0.04) }}>
            <TableCell sx={{ py: 1, borderBottom: 0 }}>
              <Typography variant="h6">别名</Typography>
            </TableCell>
            <TableCell sx={{ py: 0.5, borderBottom: 0 }} align="right">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ display: 'block', py: 0.75, mb: 0.2 }}
                  onClick={() => setOpenCreateModal(true)}
                >
                  创建别名
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        </StyledTableHead>

        <StyledTableBody>
          {aliases.length === 0 ? (
            <StyledTableRow>
              <TableCell colSpan={2} width={'100%'} align="left">
                <Typography variant="subtitle1" color="text.secondary">
                  未找到别名
                </Typography>
              </TableCell>
            </StyledTableRow>
          ) : (
            AliasList
          )}
        </StyledTableBody>
      </Table>

      <CreateAliasModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} onCreate={handleCreateAlias} />

      <ConfirmationDialog
        open={!!aliasToDelete}
        onClose={() => setAliasToDelete('')}
        title={'删除别名'}
        content={`您确定要删除别名 ${aliasToDelete} 吗？`}
        warning={`此操作无法撤销。`}
        actionName={'删除'}
        actionHandler={() => {
          deleteAlias(aliasToDelete).catch((e) => console.error(e));
          setAliasToDelete('');
        }}
      />
    </StyledTableContainer>
  );
};

const AliasRow = ({ aliasName, onDelete }) => (
  <StyledTableRow>
    <TableCell>
      <Typography variant="subtitle1" color="text.secondary">
        {aliasName}
      </Typography>
    </TableCell>
    <TableCell align="right">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title={'删除别名'} placement={'left'}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Trash size={18} />}
            sx={{
              px: '10px',
              py: '4px',
            }}
            onClick={onDelete}
            aria-label="delete"
            color="error"
            data-testid={`delete-alias-${aliasName}`}
          >
            删除
          </Button>
        </Tooltip>
      </Box>
    </TableCell>
  </StyledTableRow>
);

AliasRow.propTypes = {
  aliasName: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const CreateAliasModal = ({ open, onClose, onCreate }) => {
  const [aliasName, setAliasName] = useState('');
  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.value && error) {
      setError(false);
    }
    setAliasName(e.target.value);
  };

  const handleCreate = () => {
    if (!aliasName) {
      setError(true);
      return;
    }
    onCreate(aliasName);
    setError(false);
    setAliasName('');
  };

  const handleClose = () => {
    setError(false);
    setAliasName('');
    onClose();
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="create-alias-title"
      data-testid="create-alias-dialog"
      role="dialog"
      slotProps={{
        transition: {
          onEntered: () => {
            const input = document.getElementById('alias-name-input');
            if (input) {
              input.focus();
            }
          },
        },
      }}
    >
      <DialogTitle sx={{ p: 3 }} id="create-alias-title">
        创建集合别名
      </DialogTitle>
      <DialogContent>
        <TextField
          id="alias-name-input"
          data-testid="alias-name-input"
          placeholder="别名"
          value={aliasName}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
          error={error}
          helperText={error ? '别名不能为空' : ''}
          autoFocus
          required
          margin="dense"
          fullWidth
          variant="outlined"
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose}>
          取消
        </Button>
        <Button variant="contained" disabled={!aliasName} onClick={handleCreate} data-testid="create-alias-button">
          创建
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateAliasModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

CollectionAliases.propTypes = {
  collectionName: PropTypes.string.isRequired,
};

export default CollectionAliases;
