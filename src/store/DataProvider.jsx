import React, { useState, useEffect } from "react";
import DataContext from "./DataContext"; // Assuming you have a DataContext
import { isEqual } from "lodash";

const initialData = { allTemplates: [], backendIP: "localhost" }; // Initial data if localStorage is empty

const DataProvider = (props) => {
  // Initialize dataState from localStorage if it exists, otherwise use initialData
  const [dataState, setDataState] = useState(initialData);

  // Save dataState to localStorage whenever it changes

  // useEffect(() => {
  //   const stringifiedTemdata = JSON.stringify(dataState.allTemplates);
  //   localStorage.setItem("Template", stringifiedTemdata);
  // }, [dataState]);

  const templateHandler = (template) => {
    let newIndex;
    setDataState((prevState) => {
      // Ensure prevState.allTemplates is always an array
      const allTemplates = Array.isArray(prevState.allTemplates)
        ? prevState.allTemplates
        : [];
      newIndex = allTemplates.length; // Calculate the new index
      return {
        ...prevState,
        allTemplates: [...allTemplates, template],
      };
    });
    return newIndex; // Return the new index
  };

  const modifyTemplateHandler = (index, regionData, fieldType) => {
    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[index];

      switch (fieldType) {
        case "skewMarkField":
          currentTemplate[0].skewMarksWindowParameters = currentTemplate[0]
            .skewMarksWindowParameters
            ? [...currentTemplate[0]?.skewMarksWindowParameters, regionData]
            : [regionData];
          break;
        case "formField":
          currentTemplate[0].formFieldWindowParameters = currentTemplate[0]
            .formFieldWindowParameters
            ? [...currentTemplate[0].formFieldWindowParameters, regionData]
            : [regionData];
          break;
        case "questionField":
          currentTemplate[0].questionsWindowParameters = currentTemplate[0]
            .questionsWindowParameters
            ? [...currentTemplate[0].questionsWindowParameters, regionData]
            : [regionData];
          break;
        default:
          currentTemplate[0].layoutParameters = {
            ...currentTemplate[0].layoutParameters,
            ...regionData,
          };
          break;
      }

      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };
console.log(dataState)
  const modifyTemplateWithUUIDHandler = (uuid, regionData, fieldType) => {
    setDataState((prevState) => {
      const copiedData = [...prevState.allTemplates];
      console.log(copiedData);

      // Find the current template instead of filtering
      const currentTemplate = copiedData.find((item) => {
        console.log(item);
        return item[0].layoutParameters?.key ?? "" === uuid;
      });

      // Ensure currentTemplate is found
      if (currentTemplate) {
        switch (fieldType) {
          case "skewMarkField":
            currentTemplate[0].skewMarksWindowParameters = currentTemplate[0]
              .skewMarksWindowParameters
              ? [...currentTemplate[0].skewMarksWindowParameters, regionData]
              : [regionData];
            break;
          case "formField":
            currentTemplate[0].formFieldWindowParameters = currentTemplate[0]
              .formFieldWindowParameters
              ? [...currentTemplate[0].formFieldWindowParameters, regionData]
              : [regionData];
            break;
          case "questionField":
            currentTemplate[0].questionsWindowParameters = currentTemplate[0]
              .questionsWindowParameters
              ? [...currentTemplate[0].questionsWindowParameters, regionData]
              : [regionData];
            break;
          default:
            currentTemplate[0].layoutParameters = {
              ...currentTemplate[0].layoutParameters,
              ...regionData,
            };
            break;
        }
      }

      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };

  const deleteTemplateHandler = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (isConfirmed) {
      setDataState((prevState) => {
        const updatedTemplates = prevState.allTemplates.filter(
          (_, i) => i !== index
        );
        return {
          ...prevState,
          allTemplates: updatedTemplates,
        };
      });
    }
  };
  const addToAllTemplateHandler = (template) => {
    setDataState((prevState) => {
      return {
        ...prevState,
        allTemplates: template,
      };
    });
  };

  const addFieldToTemplateHandler = (regionData, index) => {
    const {
      formFieldWindowParameters,
      imageData,
      printingData,
      questionsWindowParameters,
      skewMarksWindowParameters,
      barcodeData,
      layoutParameters,
      imageCroppingDTO,
    } = regionData;

    const imageCoordinates = layoutParameters.imageCoordinates;
    const imageStructureData = {
      height: imageCoordinates?.height,
      x: imageCoordinates?.x,
      y: imageCoordinates?.y,
      width: imageCoordinates?.width,
    };

    const layoutCoordinates = layoutParameters.layoutCoordinates;
    console.log(layoutCoordinates);
    const Coordinate = {
      "End Col": layoutCoordinates["right"],
      "End Row": layoutCoordinates["end"],
      "Start Col": layoutCoordinates["left"],
      "Start Row": layoutCoordinates["start"],
      name: layoutCoordinates["name"],
      fieldType: layoutCoordinates["fieldType"],
    };

    const updatedLayoutParameter = {
      ...layoutParameters,
      Coordinate,
      imageStructureData,
    };
    delete updatedLayoutParameter.imageCoordinates;
    delete updatedLayoutParameter.layoutCoordinates;

    const updateCoordinates = (items, coordKey) =>
      items?.map((item) => {
        const coordinates = item[coordKey];
        const newCoordinates = coordinates
          ? {
              "End Col": coordinates["right"],
              "End Row": coordinates["end"],
              "Start Col": coordinates["left"],
              "Start Row": coordinates["start"],
              name: coordinates["name"],
              fieldType: coordinates["fieldType"],
            }
          : {};
        return { ...item, Coordinate: newCoordinates };
      });

    const updatedFormField = updateCoordinates(
      formFieldWindowParameters,
      "formFieldCoordinates"
    );
    const updatedSkewField = updateCoordinates(
      skewMarksWindowParameters,
      "layoutWindowCoordinates"
    );
    const updatedQuestionField = updateCoordinates(
      questionsWindowParameters,
      "questionWindowCoordinates"
    );

    setDataState((prevState) => {
      const copiedData = JSON.parse(JSON.stringify(prevState.allTemplates)); // Deep copy to avoid mutation
      if (!copiedData[index]) {
        console.error(`Invalid index: ${index}`);
        return prevState;
      }

      const currentTemplate = copiedData[index];
      currentTemplate[0] = {
        ...currentTemplate[0],
        skewMarksWindowParameters: updatedSkewField,
        formFieldWindowParameters: updatedFormField,
        questionsWindowParameters: updatedQuestionField,
        imageData: imageData,
        printingData: printingData,
        barcodeData: barcodeData,
        layoutParameters: updatedLayoutParameter,
        imageCroppingDTO: imageCroppingDTO,
      };

      console.log(copiedData);
      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };

  const modifyRegionWithUUIDHandler = (
    uuid,
    regionData,
    fieldType,
    coordinateIndex
  ) => {
    setDataState((item) => {
      const copiedData = [...item.allTemplates];

      // Find the current template instead of filtering
      const currentTemplate = copiedData.find((item) => {
        console.log(item);
        return item[0].layoutParameters?.key ?? "" === uuid;
      });
      if (!currentTemplate || currentTemplate.length === 0) {
        console.error("Invalid template index or empty template");
        return item;
      }

      const updateField = (fieldArray) => {
        if (
          fieldArray &&
          coordinateIndex >= 0 &&
          coordinateIndex < fieldArray.length
        ) {
          fieldArray[coordinateIndex] = regionData;
        } else {
          console.error("Invalid coordinate index");
        }
      };

      switch (fieldType) {
        case "skewMarkField":
          updateField(currentTemplate[0]?.skewMarksWindowParameters);
          break;
        case "formField":
          updateField(currentTemplate[0]?.formFieldWindowParameters);
          break;
        case "questionField":
          updateField(currentTemplate[0]?.questionsWindowParameters);
          break;
        default:
          currentTemplate[0].layoutParameters = {
            ...currentTemplate[0].layoutParameters,
            ...regionData,
          };
          break;
      }
      console.log(copiedData);
      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };
  const modifyWithRegionHandler = (
    templateIndex,
    regionData,
    fieldType,
    coordinateIndex
  ) => {
    if (coordinateIndex === -1) {
      alert("Coordinate index cannot be -1");
      return;
    }

    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[templateIndex];

      if (!currentTemplate || currentTemplate.length === 0) {
        console.error("Invalid template index or empty template");
        return item;
      }

      const updateField = (fieldArray) => {
        if (
          fieldArray &&
          coordinateIndex >= 0 &&
          coordinateIndex < fieldArray.length
        ) {
          fieldArray[coordinateIndex] = regionData;
        } else {
          console.error("Invalid coordinate index");
        }
      };

      switch (fieldType) {
        case "skewMarkField":
          updateField(currentTemplate[0]?.skewMarksWindowParameters);
          break;
        case "formField":
          updateField(currentTemplate[0]?.formFieldWindowParameters);
          break;
        case "questionField":
          updateField(currentTemplate[0]?.questionsWindowParameters);
          break;
        default:
          currentTemplate[0].layoutParameters = {
            ...currentTemplate[0].layoutParameters,
            ...regionData,
          };
          break;
      }

      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };

  const deleteFieldTemplateHandler = (templateIndex, selectedFieldData) => {
    const fieldType = selectedFieldData.fieldType;
    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[templateIndex][0];
      switch (fieldType) {
        case "skewMarkField":
          const parameters = currentTemplate?.skewMarksWindowParameters;

          const updatedSkew = parameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.skewMarksWindowParameters = updatedSkew;
          break;
        case "formField":
          const formparameters = currentTemplate?.formFieldWindowParameters;

          const updatedForm = formparameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.formFieldWindowParameters = updatedForm;
          break;
        case "questionField":
          const questionparameters = currentTemplate?.questionsWindowParameters;

          const questionForm = questionparameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.questionsWindowParameters = questionForm;
          break;
        default:
          const copiedLayout = { ...currentTemplate.layoutParameters };
          delete copiedLayout.Coordinate;
          copiedLayout.idMarksPattern = "000000000000000000000000000";
          copiedLayout.columnNumber = 0;
          copiedLayout.columnStart = 0;
          copiedLayout.columnStep = 0;
          copiedLayout.rowNumber = 0;
          copiedLayout.rowStart = 0;
          copiedLayout.rowStep = 0;
          currentTemplate.layoutParameters = copiedLayout;
          break;
      }
      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };

  const deleteFieldTemplateWithUUIDHandler = (uuid, selectedFieldData) => {
    const fieldType = selectedFieldData.fieldType;
    setDataState((item) => {
      const copiedData = [...item.allTemplates];

      // Find the current template instead of filtering
      const currentTemplate = copiedData.find((item) => {
        console.log(item);
        return item[0].layoutParameters?.key ?? "" === uuid;
      })[0];
console.log(currentTemplate)

      switch (fieldType) {
        case "skewMarkField":
          const parameters = currentTemplate?.skewMarksWindowParameters;

          const updatedSkew = parameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.skewMarksWindowParameters = updatedSkew;
          break;
        case "formField":
          const formparameters = currentTemplate?.formFieldWindowParameters;
console.log(formparameters)
          const updatedForm = formparameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.formFieldWindowParameters = updatedForm;
          break;
        case "questionField":
          const questionparameters = currentTemplate?.questionsWindowParameters;

          const questionForm = questionparameters.filter(
            (item) => !isEqual(item.Coordinate, selectedFieldData)
          );

          currentTemplate.questionsWindowParameters = questionForm;
          break;
        default:
          const copiedLayout = { ...currentTemplate.layoutParameters };
          delete copiedLayout.Coordinate;
          copiedLayout.idMarksPattern = "000000000000000000000000000";
          copiedLayout.columnNumber = 0;
          copiedLayout.columnStart = 0;
          copiedLayout.columnStep = 0;
          copiedLayout.rowNumber = 0;
          copiedLayout.rowStart = 0;
          copiedLayout.rowStep = 0;
          currentTemplate.layoutParameters = copiedLayout;
          break;
      }
      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };

  const addRegionDataHandler = (index, regionData, fieldType) => {
    setDataState((item) => {
      const copiedData = [...item.allTemplates];
      const currentTemplate = copiedData[index];

      switch (fieldType) {
        case "skewMarkField":
          currentTemplate[0].skewMarksWindowParameters = currentTemplate[0]
            .skewMarksWindowParameters
            ? [...currentTemplate[0]?.skewMarksWindowParameters, regionData]
            : [regionData];
          break;
        case "formField":
          currentTemplate[0].formFieldWindowParameters = currentTemplate[0]
            .formFieldWindowParameters
            ? [...currentTemplate[0].formFieldWindowParameters, regionData]
            : [regionData];
          break;
        case "questionField":
          currentTemplate[0].questionsWindowParameters = currentTemplate[0]
            .questionsWindowParameters
            ? [...currentTemplate[0].questionsWindowParameters, regionData]
            : [regionData];
          break;
        default:
          currentTemplate[0].layoutParameters = {
            ...currentTemplate[0].layoutParameters,
            ...regionData,
          };
          break;
      }

      return {
        ...item,
        allTemplates: copiedData,
      };
    });
  };
  const addImageCoordinateWithIndexHandler = (
    templateIndex,
    imageCoordinates
  ) => {
    setDataState((prevState) => {
      // Create a deep copy of the current state to avoid direct mutation
      const copiedData = [...prevState.allTemplates];

      // If a matching template is found, update its imageCroppingDTO
      if (templateIndex !== -1) {
        copiedData[templateIndex][0].imageCroppingDTO = imageCoordinates;
      }

      // Return the new state
      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };
  const addImageCoordinateHandler = (uuid, imageCoordinates) => {
    setDataState((prevState) => {
      // Create a deep copy of the current state to avoid direct mutation
      const copiedData = [...prevState.allTemplates];

      // Find the index of the current template
      const templateIndex = copiedData.findIndex((template) => {
        return template[0].layoutParameters?.key ?? "" === uuid;
      });
      console.log(templateIndex);
      // If a matching template is found, update its imageCroppingDTO
      if (templateIndex !== -1) {
        copiedData[templateIndex][0].imageCroppingDTO = imageCoordinates;
      }

      // Return the new state
      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };

  const updateLayoutParameterHandler = (templateIndex, dataField) => {
    setDataState((prevState) => {
      // Make sure the index is valid
      if (templateIndex < 0 || templateIndex >= prevState.allTemplates.length) {
        console.warn("Invalid templateIndex:", templateIndex);
        return prevState; // or handle the error as needed
      }

      // Destructure dataField
      const { layoutParameters, imageData, printingData, barcodeData } =
        dataField;

      // Clone the previous state
      const copiedData = [...prevState.allTemplates];
      const currentTemplate = copiedData[templateIndex][0];

      // Update the fields in the current template
      currentTemplate.layoutParameters = {
        ...currentTemplate.layoutParameters,
        ...layoutParameters, // Assuming you want to merge with existing layoutParameters
      };
      currentTemplate.imageData = {
        ...currentTemplate.imageData,
        ...imageData, // Assuming you want to merge with existing imageData
      };
      currentTemplate.printingData = {
        ...currentTemplate.printingData,
        ...printingData, // Assuming you want to merge with existing printingData
      };
      currentTemplate.barcodeData = {
        ...currentTemplate.barcodeData,
        ...barcodeData, // Assuming you want to merge with existing barcodeData
      };

      // Return the new state
      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };

  const updateTemplateParameterHandler = (templateIndex, dataField) => {
    setDataState((prevState) => {
      // Make sure the index is valid
      if (templateIndex < 0 || templateIndex >= prevState.allTemplates.length) {
        console.warn("Invalid templateIndex:", templateIndex);
        return prevState; // or handle the error as needed
      }

      // Destructure dataField
      const { layoutParameters, imageData, printingData, barcodeData } =
        dataField;

      // Clone the previous state
      const copiedData = [...prevState.allTemplates];
      const currentTemplate = copiedData[templateIndex][0];

      // Update the fields in the current template
      currentTemplate.layoutParameters = {
        ...currentTemplate.layoutParameters,
        ...layoutParameters, // Assuming you want to merge with existing layoutParameters
      };
      currentTemplate.imageData = {
        ...currentTemplate.imageData,
        ...imageData, // Assuming you want to merge with existing imageData
      };
      currentTemplate.printingData = {
        ...currentTemplate.printingData,
        ...printingData, // Assuming you want to merge with existing printingData
      };
      currentTemplate.barcodeData = {
        ...currentTemplate.barcodeData,
        ...barcodeData, // Assuming you want to merge with existing barcodeData
      };

      // Return the new state
      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };
  const setBackendIPHandler = (enteredIP) => {
    setDataState((prevState) => {
      return {
        ...prevState,
        backendIP: enteredIP,
      };
    });
  };
  const templateReplaceHandler = (templateData) => {
    setDataState((prevState) => {
      // Clone the previous state's allTemplates array
      const copiedData = [...prevState.allTemplates];

      // Find the index of the template with the matching UUID
      const templateIndex = copiedData.findIndex(
        (item) =>
          item[0]?.layoutParameters?.key === templateData[0]?.layoutParameters.key
      );

      // If the template is found, replace it with the new data
      if (templateIndex !== -1) {
        copiedData[templateIndex] = templateData;
      } else {
        console.warn(`Template with UUID not found.`);
      }

      // Return the new state object
      return {
        ...prevState,
        allTemplates: copiedData,
      };
    });
  };

  const dataContext = {
    allTemplates: dataState.allTemplates,
    setAllTemplates: templateHandler,
    modifyAllTemplate: modifyTemplateHandler,
    deleteTemplate: deleteTemplateHandler,
    addToAllTemplate: addToAllTemplateHandler,
    addFieldToTemplate: addFieldToTemplateHandler,
    modifyWithRegion: modifyWithRegionHandler,
    deleteFieldTemplate: deleteFieldTemplateHandler,
    modifyRegionWithUUID: modifyRegionWithUUIDHandler,
    addRegionData: addRegionDataHandler,
    modifyTemplateWithUUID: modifyTemplateWithUUIDHandler,
    deleteFieldTemplateWithUUID: deleteFieldTemplateWithUUIDHandler,
    addImageCoordinate: addImageCoordinateHandler,
    updateLayoutParameter: updateLayoutParameterHandler,
    updateTemplateParameter: updateTemplateParameterHandler,
    addImageCoordinateWithIndex: addImageCoordinateWithIndexHandler,
    setBackendIP: setBackendIPHandler,
    replaceTemplate: templateReplaceHandler,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataProvider;
