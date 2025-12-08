import { elements } from "../flow.js";
import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import components from "../inputs/components-map.jsx";
import {
  CCFormButton,
  CCFormCard,
  CCFormSubtitle,
  CCFormTitle,
} from "../ThemedComponents.jsx";
import React, { Fragment, useEffect } from "react";
import { checkCompleted } from "../inputs/checkCompleted.js";

const GenericElementsStep = function ({
  stepName,
  config,
  stepData,
  onApply,
  isLast = true,
  handleClear,
  useCard = false,
}) {
  const value = stepData || {};

  let isStepCompleted = true;
  const totalElements = config.elements && config.elements.length;

  const elementsContent =
    config.elements &&
    config.elements.map((element, idx) => {
      const elementConfig = {
        ...(elements[element.type] || {}),
        ...element,
      };

      const elementData = value[element.name];

      const isElementRequired = elementConfig.required === true;
      const isElementCompleted = checkCompleted(elementData, isElementRequired);

      isStepCompleted = isStepCompleted && isElementCompleted;

      const onChange = (value) => {
        // We need to understand if stepData is completed.
        // If value if an object, we need to rely on completed field.
        // If value is something else, we just check that it is not empty.
        const newValue = { ...stepData, [element.name]: value };
        onApply(stepName, newValue, null);
      };
      const Component = components[element.type];
      if (!Component) {
        console.log("Skipping element", element.type);
        return null;
      }
      return (
        <Fragment key={idx}>
          <Component
            key={element.name}
            config={elementConfig}
            stepData={elementData}
            onChange={onChange}
            isLast={idx === totalElements - 1 && isLast}
          />
        </Fragment>
      );
    });

  const renderedElements = useCard ? (
    <Grid size={12}>
      <CCFormCard elevation={0}>
        <Grid container spacing={2}>
          {elementsContent}
        </Grid>
      </CCFormCard>
    </Grid>
  ) : (
    elementsContent
  );

  useEffect(() => {
    const isRegisteredCompleted = stepData && stepData.completed === true;
    if (isStepCompleted !== isRegisteredCompleted) {
      onApply(stepName, { ...stepData, completed: isStepCompleted }, null);
    }
  }, [stepData, isStepCompleted, onApply, stepName]);

  const stepContent = (
    <>
      {renderedElements}
      {config.button && isLast && (
        <Grid size={12} display={"flex"} justifyContent={"flex-end"}>
          {handleClear && typeof handleClear === "function" && (
            <CCFormButton variant="text" onClick={handleClear}>
              Clear
            </CCFormButton>
          )}
          <CCFormButton
            disabled={!isStepCompleted}
            variant="contained"
            onClick={() =>
              onApply(
                stepName,
                value,
                config.button["on-click"]["continue-step"],
              )
            }
            sx={{ ml: 4 }}
          >
            {config.button.title}
          </CCFormButton>
        </Grid>
      )}
    </>
  );

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <CCFormTitle>{config.title}</CCFormTitle>
        {config.description && (
          <CCFormSubtitle>{config.description}</CCFormSubtitle>
        )}
      </Grid>
      {stepContent}
    </Grid>
  );
};

// props validation
GenericElementsStep.propTypes = {
  stepName: PropTypes.string.isRequired,
  config: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    elements: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    button: PropTypes.shape({
      title: PropTypes.string.isRequired,
      "on-click": PropTypes.shape({
        "continue-step": PropTypes.string,
      }),
    }),
  }),
  stepData: PropTypes.any,
  onApply: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
  handleClear: PropTypes.func,
  useCard: PropTypes.bool,
};

export default GenericElementsStep;