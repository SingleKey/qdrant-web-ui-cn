import React from "react";
import { AccordionDetails, AccordionSummary, Grid } from "@mui/material";
import GenericInputs from "./GenericInputs";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { CCFormAccordion } from "../ThemedComponents.jsx";

const Details = function ({ config, stepData, onChange }) {
  const size = config.size || 12;

  return (
    <Grid size={size}>
      <CCFormAccordion>
        <AccordionSummary expandIcon={<ChevronDown size={20} />}>
          高级配置
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <GenericInputs
              config={config}
              stepData={stepData}
              onChange={onChange}
            />
          </Grid>
        </AccordionDetails>
      </CCFormAccordion>
    </Grid>
  );
};

Details.propTypes = {
  config: PropTypes.shape({
    name: PropTypes.string,
    elements: PropTypes.array,
    size: PropTypes.number,
  }).isRequired,
  stepData: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default Details;
