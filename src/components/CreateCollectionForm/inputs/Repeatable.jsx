import PropTypes from "prop-types";
import { Add, Delete } from "@mui/icons-material";
import { Divider, Grid } from "@mui/material";
import { CCFormButton, CCFormCard } from "../ThemedComponents.jsx";
import GenericInputs from "./GenericInputs";
import React, { useEffect } from "react";
import { useScrollableParent } from "../context/scrollable-parent-context.jsx";

const Repeatable = ({ config, stepData, onChange, isLast = false }) => {
  const values = stepData || [];
  const scrollableParent = useScrollableParent();

  const numValues = values.length;

  const maxRepetitions = config?.maxRepetitions || 10000;

  useEffect(() => {
    // Check if stepData is an array
    if (!Array.isArray(stepData)) {
      console.log("Repeatable: stepData is not an array", stepData);
      onChange([]);
    }
  }, [stepData, onChange]);

  const handleAdd = () => {
    const newValues = [...values, {}];
    onChange(newValues);
  };

  useEffect(() => {
    if (isLast) {
      const currentScrollableParent = scrollableParent();
      const currentScrollHeight =
        currentScrollableParent === window
          ? document.documentElement.scrollHeight
          : currentScrollableParent.scrollHeight;
      currentScrollableParent.scrollTo({
        top: currentScrollHeight,
        behavior: "smooth",
      });
    }
  }, [numValues]);

  const handleRemove = (index) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <Grid size={12}>
      {values.map((value, index) => {
        const elementOnChange = (value) => {
          const newValues = [...values];
          newValues[index] = value;
          onChange(newValues);
        };

        return (
          <CCFormCard
            elevation={0}
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "column",
            }}
            key={index}
          >
            <Grid container spacing={2}>
              <GenericInputs
                config={config}
                stepData={value}
                onChange={elementOnChange}
              />
            </Grid>

            <Divider sx={{ mt: 2, mb: 3 }} />

            <CCFormButton
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Delete />}
              sx={{ alignSelf: "end" }}
              onClick={() => handleRemove(index)}
            >
              删除
            </CCFormButton>
          </CCFormCard>
        );
      })}
      {values.length < maxRepetitions && (
        <CCFormButton
          variant="text"
          size="medium"
          color="secondary"
          startIcon={<Add />}
          onClick={handleAdd}
        >
          Add
        </CCFormButton>
      )}
    </Grid>
  );
};

Repeatable.propTypes = {
  config: PropTypes.shape({
    name: PropTypes.string.isRequired,
    elements: PropTypes.array,
    maxRepetitions: PropTypes.number,
  }).isRequired,
  stepData: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
};

export default Repeatable;
