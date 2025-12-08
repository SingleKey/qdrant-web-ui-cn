import React from "react";
import PropTypes from "prop-types";
import { Autocomplete, MenuItem, Typography } from "@mui/material";
import {
  CCFormControl,
  CCFormInputBase,
  CCFormLabel,
} from "../ThemedComponents.jsx";

const NumberWithSuggestions = ({ config, stepData, onChange }) => {
  const value = stepData || "";

  return (
    <Autocomplete
      freeSolo
      options={config.suggestions}
      getOptionLabel={(option) => option.value.toString()}
      inputValue={value + ""}
      onInputChange={(event, newInputValue) => {
        let valueNumber = parseInt(newInputValue);
        if (isNaN(valueNumber)) {
          valueNumber = "";
        }
        onChange(valueNumber);
      }}
      renderOption={(props, option) => {
        // Render option as value (bold) + label (normal)
        const { key, ...optionProps } = props;
        return (
          <MenuItem key={key} {...optionProps}>
            <Typography variant="body1" fontWeight="bold">
              {option.value}&nbsp;
            </Typography>
            - {option.label}
          </MenuItem>
        );
      }}
      renderInput={(params) => (
        <CCFormControl variant="standard">
          <CCFormLabel shrink htmlFor={config.name}>
            {config.title}
          </CCFormLabel>
          <CCFormInputBase
            {...params.InputProps}
            inputProps={params.inputProps}
            variant="outlined"
            id={config.name}
            placeholder={config.placeholder || ""}
            value={value || config.default || ""}
          />
        </CCFormControl>
      )}
    />
  );
};

// props validation
NumberWithSuggestions.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    default: PropTypes.number,
    suggestions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
      }),
    ).isRequired,
    placeholder: PropTypes.string,
  }).isRequired,
  stepData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
};

export default NumberWithSuggestions;