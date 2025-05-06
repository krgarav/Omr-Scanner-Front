import React from "react";
const ImageContext = React.createContext({
  allImages: [],
  addToAllImages: () => {},
  setAllTemplates: () => {},
  removeFromAllImages: () => {},
  modifyFromAllImages: () => {},
});

export default ImageContext;

