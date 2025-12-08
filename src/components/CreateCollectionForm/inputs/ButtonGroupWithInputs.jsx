import React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { CCFormLabel } from "../ThemedComponents.jsx";
import GenericInputs from "./GenericInputs.jsx";
import { CCFormSelectCard } from "../ThemedComponents.jsx";

/*
Component capable of rendering the following configuration:

{
    type: "button-group-with-inputs",
    name: "field_config",
    enums: [
        {
        name: "keyword",
        },
        {
        name: "integer",
        fields: [
            {
            name: "lookup",
            type: "checkbox",
            default: true,
            },
            {
            name: "range",
            type: "checkbox",
            default: true,
            },
        ],
        },
        {
        name: "float",
        },
        {
        name: "uuid",
        },
        {
        name: "datetime",
        },
        {
        name: "text",
        fields: [
            {
            name: "tokenizer",
            type: "dropdown",
            options: ["prefix", "whitespace", "word", "multilingual"],
            },
            {
            name: "lowercase",
            type: "checkbox",
            default: true,
            },
            {
            name: "min_token_length",
            type: "number",
            default: null,
            },
            {
            name: "max_token_length",
            type: "number",
            default: null,
            },
        ],
        },
        {
        name: "geo",
        },
        {
        name: "bool",
        },
    ],
    },
*/

const ButtonGroupWithInputs = function ({ config, stepData, onChange }) {
  const allEnumsObject = {};
  config.enums.forEach((enumObject) => {
    allEnumsObject[enumObject.name] = enumObject;
  });

  const selectedEnum = stepData && stepData[config.name + "_enum"];

  const selecedEnumData = allEnumsObject[selectedEnum] || {};
  const selectedEnumFields = selecedEnumData.fields || [];

  const fieldsConfig = {
    elements: selectedEnumFields,
    name: config.name + "_config",
  };

  const size = config?.size || 12;

  let buttonSelected = false;

  const currentButtonValue = stepData && stepData[config.name + "_enum"];
  if (currentButtonValue) {
    buttonSelected = true;
  }

  return (
    <>
      <Grid size={size}>
        <CCFormLabel shrink sx={{ mt: 1, mb: 1 }}>
          {config.title}
        </CCFormLabel>

        {/* Select one of the enums with group button */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          {config.enums.map((enumObject) => {
            const configOnChange = function (value) {
              const newData = {
                ...stepData,
                [config.name + "_enum"]: value,
              };
              onChange(newData);
            };

            return (
              <Box key={enumObject.name}>
                <CCFormSelectCard
                  sx={{
                    px: 2,
                    py: 1,
                  }}
                  onClick={() => configOnChange(enumObject.name)}
                  className={selectedEnum === enumObject.name ? "active" : ""}
                  variant="contained"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      configOnChange(enumObject.name);
                    }
                  }}
                >
                  {enumObject.name}
                </CCFormSelectCard>
              </Box>
            );
          })}
        </Box>

        {/* Render fields of the selected enum */}
      </Grid>
      <Grid size={12}>
        <Grid container spacing={2}>
          <GenericInputs
            config={fieldsConfig}
            stepData={{
              ...stepData,
              parentCompleted: buttonSelected,
            }}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

// todo: decide on default stepData alternative name

// props validation
ButtonGroupWithInputs.propTypes = {
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    size: PropTypes.number,
    enums: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        fields: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            type: PropTypes.string.isRequired,
            name: PropTypes.string,
            default: PropTypes.any,
          }),
        ),
      }),
    ),
  }).isRequired,
  stepData: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default ButtonGroupWithInputs;
