import { toast } from "react-toastify";

export const validateFormField = () => {
    const errors = {
      name: "Name Field can not be empty",
      multiple: "Please select multiple",
      blank: "Please select blank",
      windowNgOption: "Please select window Ng",
      minimumMark: "Minimum mark cannot be empty",
      maximumMark: "Maximum mark cannot be empty",
      noInRow: "Total number in row cannot be empty",
      noOfStepInRow: "Total number of step in a row cannot be empty",
      noInCol: "Total number in col cannot be empty",
      noOfStepInCol: "Total number of step in a col cannot be empty",
      readingDirectionOption: "Please select reading direction",
      type: "Please select type",
      option: "Please select option",
      numberOfField: "Total field cannot be empty",
      fieldType: "Please select field type",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };

  export const validateSkewField = () => {
    const errors = {
      name: "Name Field can not be empty",
      windowNgOption: "Please select window Ng",
      minimumMark: "Minimum mark cannot be empty",
      maximumMark: "Maximum mark cannot be empty",
      skewoption: "Please select the skew mark position",
      noInRow: "Total number in row cannot be empty",
      noOfStepInRow: "Total number of step in a row cannot be empty",
      noInCol: "Total number in col cannot be empty",
      noOfStepInCol: "Total number of step in a col cannot be empty",
      readingDirectionOption: "Please select reading direction",
      type: "Please select type",
      option: "Please select option",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };
  export const validateIdField = () => {
    const errors = {
      noInRow: "Total number in row cannot be empty",
      noOfStepInRow: "Total number of step in a row cannot be empty",
      noInCol: "Total number in col cannot be empty",
      noOfStepInCol: "Total number of step in a col cannot be empty",
      readingDirectionOption: "Please select reading direction",
    };

    for (let [field, errorMsg] of Object.entries(errors)) {
      if (!eval(field)) {
        toast.error(errorMsg);
        return false;
      }
    }
    return true;
  };