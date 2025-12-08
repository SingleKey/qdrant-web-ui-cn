import React from "react";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";

const SizeWrapper = ({ config, element, ...other }) => {
  return (
    <Grid size={{ xs: 12, md: config?.size || 6 }}>
      {element({ config, ...other })}
    </Grid>
  );
};

SizeWrapper.propTypes = {
  config: PropTypes.shape({
    size: PropTypes.number,
  }),
  element: PropTypes.func.isRequired,
};

export default SizeWrapper;
