import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, OutlinedInput, MenuItem, TextField, Typography, InputLabel } from '@mui/material';
import TokenValidatior from './TokenValidatior';
import JwtPerCollection from './JwtPerCollection';
import StyledButtonGroup from '../Common/StyledButtonGroup';

const ExpirationSelect = ({ expiration, setExpiration }) => {
  const handleChange = (event) => {
    setExpiration(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }} role="group">
      <InputLabel
        htmlFor="expiration-select"
        sx={{
          color: 'text.primary',
          fontWeight: 500,
        }}
      >
        过期时间
      </InputLabel>
      <TextField
        select
        fullWidth
        id="expiration-select"
        value={expiration}
        onChange={handleChange}
        slots={{
          input: OutlinedInput,
        }}
        sx={{
          '& .MuiSelect-outlined': {
            py: 1.5,
          },
        }}
      >
        <MenuItem value={1}>1天</MenuItem>
        <MenuItem value={7}>7天</MenuItem>
        <MenuItem value={30}>30天</MenuItem>
        <MenuItem value={90}>90天</MenuItem>
        <MenuItem value={0}>永不</MenuItem>
      </TextField>
    </Box>
  );
};

ExpirationSelect.propTypes = {
  expiration: PropTypes.number.isRequired,
  setExpiration: PropTypes.func.isRequired,
};

function JwtForm({
  expiration,
  setExpiration,
  globalAccess,
  setGlobalAccess,
  manageAccess,
  setManageAccess,
  collections,
  setConfiguredCollections,
  setTokenValidatior,
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }} role="form">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
        <StyledButtonGroup fullWidth variant="outlined" aria-label="Access Level">
          <Button
            variant={!globalAccess && !manageAccess ? 'contained' : 'outlined'}
            onClick={() => {
              setManageAccess(false);
              setGlobalAccess(false);
            }}
          >
            集合访问
          </Button>
          <Button
            variant={globalAccess && !manageAccess ? 'contained' : 'outlined'}
            onClick={() => {
              setManageAccess(false);
              setGlobalAccess(true);
              setConfiguredCollections([]); // Reset collections if global or managed access is selected
            }}
          >
            全局访问
          </Button>
          <Button
            variant={manageAccess ? 'contained' : 'outlined'}
            onClick={() => {
              setManageAccess(true);
              setGlobalAccess(true);
              setConfiguredCollections([]); // Reset collections if global or managed access is selected
            }}
          >
            管理访问
          </Button>
        </StyledButtonGroup>

        {/* Description of the access level, displayed depending on the button selection*/}
        {manageAccess && (
          <Typography variant="body2" color="text.secondary">
            <strong>管理访问:</strong> 对Qdrant中存储的所有数据的完全访问权限。此访问级别允许您
            对所有集合进行读写操作，以及创建和删除集合、修改集合
            设置等。
          </Typography>
        )}
        {globalAccess && !manageAccess && (
          <Typography variant="body2" color="text.secondary">
            <strong>全局访问:</strong> 允许对Qdrant中存储的所有数据进行只读访问。
          </Typography>
        )}
        {!globalAccess && !manageAccess && (
          <Typography variant="body2" color="text.secondary">
            <strong>集合访问:</strong>
            此访问级别允许为特定集合配置访问权限。
          </Typography>
        )}
      </Box>

      {collections.length > 0 && (
        <JwtPerCollection
          globalAccess={globalAccess}
          collections={collections}
          setConfiguredCollections={setConfiguredCollections}
          manageAccess={manageAccess}
        />
      )}

      <TokenValidatior setTokenValidatior={setTokenValidatior} />

      <ExpirationSelect expiration={expiration} setExpiration={setExpiration} />
    </Box>
  );
}

JwtForm.propTypes = {
  expiration: PropTypes.number.isRequired,
  setExpiration: PropTypes.func.isRequired,
  globalAccess: PropTypes.bool.isRequired,
  setGlobalAccess: PropTypes.func.isRequired,
  manageAccess: PropTypes.bool.isRequired,
  setManageAccess: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  setConfiguredCollections: PropTypes.func.isRequired,
  setTokenValidatior: PropTypes.func.isRequired,
};

export default JwtForm;
