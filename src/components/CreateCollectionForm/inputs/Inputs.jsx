import React, { useEffect, useRef } from "react";
import { Box, FormControlLabel, MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import {
  CCFormCheckbox,
  CCFormControl,
  CCFormInputBase,
  CCFormLabel,
} from "../ThemedComponents.jsx";
import Description from "./Description.jsx";

export const Dropdown = ({ config, stepData, onChange }) => {
  const value = stepData || "";

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <CCFormControl variant="standard">
      <CCFormLabel shrink htmlFor={config.name}>
        {config.title}
      </CCFormLabel>
      <Select
        labelId=""
        id=""
        value={value}
        onChange={handleChange}
        input={<CCFormInputBase variant="outlined" />}
        MenuProps={{
          classes: {
            list: "dropdown-list",
          },
        }}
      >
        {config.options.map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          return (
            <MenuItem key={optionValue} value={optionValue}>
              {optionLabel}
            </MenuItem>
          );
        })}
      </Select>
      {config.description && <Description config={config} sx={{ mt: "3px" }} />}
    </CCFormControl>
  );
};

// props validation
Dropdown.propTypes = {
  config: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ])
    ).isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  stepData: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const StringInput = ({ config, stepData, onChange }) => {
  const defaultValue = config.default || "";

  const value = !stepData && stepData !== "" ? defaultValue : stepData;

  // we can specify in the flow.js if we want to set focus on the input
  const inputRef = useRef(null);
  useEffect(() => {
    if (config.setFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [config.setFocus]);

  // todo:
  // validate input
  return (
    <CCFormControl variant="standard">
      {config.title && (
        <CCFormLabel shrink htmlFor={config.name}>
          {config.title}
        </CCFormLabel>
      )}
      <CCFormInputBase
        key={config.title}
        id={config.name}
        placeholder={config.placeholder || ""}
        inputRef={inputRef}
        variant="outlined"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      {config.description && <Description config={config} sx={{ mt: "3px" }} />}
    </CCFormControl>
  );
};

// props validation
StringInput.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    default: PropTypes.string,
    placeholder: PropTypes.string,
    variant: PropTypes.string,
    description: PropTypes.string,
    setFocus: PropTypes.bool,
  }).isRequired,
  stepData: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const Checkbox = ({ config, stepData, onChange }) => {
  const value = stepData || false;

  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  return (
    <Box>
      <CCFormControl sx={{ display: "flex", flexDirection: "row" }}>
        <FormControlLabel
          label={config.title}
          control={
            <CCFormCheckbox
              size="small"
              sx={{ alignSelf: "start" }}
              checked={value}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
        />
      </CCFormControl>
      {config.description && <Description config={config} />}
    </Box>
  );
};

// props validation
Checkbox.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  stepData: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export const NumberInput = ({ config, stepData, onChange }) => {
  const value = stepData || 0;

  const maxValue = config?.max;
  const minValue = config?.min;

  const handleChange = (e) => {
    let valueNumber = parseInt(e.target.value);
    if (isNaN(valueNumber)) {
      valueNumber = 0;
    } else {
      if (maxValue && valueNumber > maxValue) {
        valueNumber = maxValue;
      }
      if (minValue && valueNumber < minValue) {
        valueNumber = minValue;
      }
    }
    onChange(valueNumber);
  };

  return (
    <CCFormControl variant="standard">
      <CCFormLabel shrink htmlFor={config.name}>
        {config.title}
      </CCFormLabel>
      <CCFormInputBase
        key={config.title}
        variant="outlined"
        id={config.name}
        value={value || config.default || ""}
        onChange={handleChange}
        ownerState={{ variant: "outlined" }}
      />
    </CCFormControl>
  );
};

// props validation
NumberInput.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    default: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
  }).isRequired,
  stepData: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};