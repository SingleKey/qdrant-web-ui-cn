import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useClient } from '../../context/client-context';
import ErrorNotifier from '../ToastNotifications/ErrorNotifier';
import ConfirmationDialog from '../Common/ConfirmationDialog';

export default function DeleteDialog({ open, setOpen, collectionName, getCollectionsCall }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { client: qdrantClient } = useClient();

  async function callDelete() {
    try {
      await qdrantClient.deleteCollection(collectionName);
      getCollectionsCall();
      setOpen(false);
      setHasError(false);
    } catch (error) {
      setErrorMessage(`Deletion Unsuccessful, error: ${error.message}`);
      setHasError(true);
      setOpen(false);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {hasError && <ErrorNotifier {...{ message: errorMessage }} />}
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        title={'您确定要删除 ' + collectionName + ' 吗？'}
        warning={
          '删除集合的操作无法撤销。' +
          '请确保在继续操作前已备份所有重要数据。'
        }
        actionName={'删除'}
        actionHandler={callDelete}
        aria-label="删除集合确认对话框"
      />
    </>
  );
}

DeleteDialog.propTypes = {
  collectionName: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  getCollectionsCall: PropTypes.func.isRequired,
};
