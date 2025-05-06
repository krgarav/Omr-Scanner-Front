import React from "react";
const DataContext = React.createContext({
  allTemplates: [],
  backendIP : "localhost",
  addToAllTemplate: () => {},
  setAllTemplates: () => {},
  modifyAllTemplate: () => {},
  modifyWithRegion : ()=>{},
  deleteTemplate: () => {},
  deleteFieldTemplate : ()=>{},
  modifyRegionWithUUID : ()=>{},
  addImageCoordinate : ()=>{},
  setBackendIP : ()=>{},
});

export default DataContext;
