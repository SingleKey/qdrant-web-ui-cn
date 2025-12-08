import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { CopyTextButton } from '../Common/CopyTextButton';
import { bigIntJSON } from '../../common/bigIntJSON';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)({
  display: 'flex',
  padding: '0.25rem 0.625rem',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.8125rem',
  fontStyle: 'normal',
  fontWeight: 500,
  textTransform: 'capitalize',
});

/**
 * Component for displaying vectors of a point
 * @param {Object} point
 * @param {function} onConditionChange
 * @returns {JSX.Element|null}
 * @constructor
 */
const Vectors = memo(function Vectors({ point, onConditionChange }) {
  const { collectionName } = useParams();
  const navigate = useNavigate();
  if (!Object.getOwnPropertyDescriptor(point, 'vector')) {
    return null;
  }

  // to unify the code, we will convert the vector to an object
  // when there is only one vector in the point
  let vectors = {};
  if (Array.isArray(point.vector)) {
    vectors[''] = point.vector;
  } else {
    vectors = point.vector;
  }

  const handleNavigate = (key) => {
    navigate(`/collections/${collectionName}/graph`, { state: { newInitNode: point, vectorName: key } });
  };

  return (
    <Box>
      <Typography variant="subtitle2">向量:</Typography>
      {Object.keys(vectors).map((key) => {
        return (
          <Grid key={key} container spacing={2} alignItems={'center'}>
            <Grid size={{ xs: 12, md: 4 }} display={'flex'} alignItems={'center'}>
              {key === '' ? (
                <Typography variant="body2" color="text.secondary" display={'inline'} mr={1}>
                  默认向量
                </Typography>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" display={'inline'} mr={1}>
                    名称:
                  </Typography>
                  <Chip label={key} size="small" variant="outlined" sx={{ mr: 1 }} />
                </>
              )}
            </Grid>
            <Grid my={1} size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" color="text.secondary" display={'inline'} mr={1}>
                长度:
              </Typography>
              <Chip
                sx={{
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '13px',
                }}
                label={
                  Array.isArray(vectors[key])
                    ? Array.isArray(vectors[key][0])
                      ? `${vectors[key].length}x${vectors[key][0].length}`
                      : vectors[key].length
                    : vectors[key]?.indices?.length
                }
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid
              my={1}
              sx={{
                display: 'flex',
                justifyContent: 'end',
                gap: 2,
              }}
              size={{ xs: 12, md: 4 }}
              display={'flex'}
              alignItems={'center'}
            >
              <CopyTextButton
                text={bigIntJSON.stringify(vectors[key])}
                tooltip={'复制向量到剪贴板'}
                tooltipPlacement={'left'}
                successMessage={`已复制 ${key === '' ? '默认向量' : '向量 ' + key} 到剪贴板`}
                buttonProps={{
                  size: 'small',
                }}
              />
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => handleNavigate(key)}
                sx={{
                  width: { xs: '100%', md: 'auto' },
                }}
              >
                打开图谱
              </StyledButton>
              {typeof onConditionChange !== 'function' ? null : (
                <StyledButton
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    onConditionChange([{ key: 'id', type: 'id', value: point.id }], key === '' ? null : key)
                  }
                  sx={{
                    width: { xs: '100%', md: 'auto' },
                  }}
                >
                  查找相似
                </StyledButton>
              )}
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
});

Vectors.propTypes = {
  point: PropTypes.object.isRequired,
  onConditionChange: PropTypes.func,
};

export default Vectors;
