import DenseVectorConfiguration from "./DenseVectorConfiguration.jsx";
import SparseVectorConfiguration from "./SparseVectorConfiguration.jsx";
import NumberWithSuggestions from "./NumberWithSuggestions.jsx";
import ButtonGroupWithInputs from "./ButtonGroupWithInputs.jsx";
import Repeatable from "./Repeatable.jsx";
import Group from "./Group.jsx";
import Details from "./Details.jsx";
import EnumSlider from "./EnumSlider.jsx";

import { Checkbox, Dropdown, NumberInput, StringInput } from "./Inputs.jsx";

import SizeWrapper from "./SizeWrapper.jsx";
import Description from "./Description.jsx";

function wrapWithSize(component) {
  return function (params) {
    return SizeWrapper({ element: component, ...params });
  };
}

const components = {
  "dense-vector-configuration": DenseVectorConfiguration,
  "sparse-vector-configuration": SparseVectorConfiguration,
  "string-input": wrapWithSize(StringInput),
  "number-with-suggestions": wrapWithSize(NumberWithSuggestions),
  "button-group-with-inputs": ButtonGroupWithInputs,
  dropdown: wrapWithSize(Dropdown),
  checkbox: wrapWithSize(Checkbox),
  repeatable: Repeatable,
  number: wrapWithSize(NumberInput),
  group: Group,
  description: wrapWithSize(Description),
  details: Details,
  "enum-slider": wrapWithSize(EnumSlider),
};

export default components;