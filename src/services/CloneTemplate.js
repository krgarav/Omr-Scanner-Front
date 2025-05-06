import { getLayoutDataById } from "helper/TemplateHelper";
import base64ToFile from "./Base64toFile";
import { getTemplateCsv } from "helper/TemplateHelper";
import { getTemplateImage } from "helper/TemplateHelper";
import Papa from "papaparse";
import { sendFile } from "helper/TemplateHelper";
import { createTemplate } from "helper/TemplateHelper";
const CloneTemplateHandler = async (templateId, name) => {
  try {
    // Fetch layout data
    const res = await getLayoutDataById(templateId);
    const templateFile = res.templateFiles.slice(-3);

    if (templateFile.length < 3) {
      return "No images found in this template. Cannot open the template.";
    }

    const csvpath = res?.templateFiles[2].excelPath;
    const frontImgpath = res?.templateFiles[0].imagePath;
    const backImgpath = res?.templateFiles[1].imagePath;

    // Fetch front and back images
    const [res1, res3] = await Promise.all([
      getTemplateImage(frontImgpath),
      getTemplateImage(backImgpath),
    ]);

    if (res3 === undefined) {
      return "No back image found in this template. Cannot open the template.";
    }

    const backImgfile = base64ToFile(res3.image, "back.jpg");

    if (res1 === undefined) {
    //   alert("No front image found in thi/s template. Cannot open the template.");
      return "No front image found in this template. Cannot open the template.";
    }

    const frontImgfile = base64ToFile(res1.image, "front.jpg");

    // Fetch CSV data
    const res2 = await getTemplateCsv(csvpath);

    if (res2 === undefined) {
      alert("No CSV found in this template. Cannot open the template.");
      return;
    }

    const csv = Papa.unparse(res2.data);
    const blob = new Blob([csv], { type: "text/csv" });
    const csvfile = new File([blob], "data.csv", { type: "text/csv" });
   // Prepare layout name
   const layoutName = name || `${res.layoutParameters.layoutName}-copy`;
   res.layoutParameters.layoutName = layoutName;
 
    const fullRequestData = {
      layoutParameters: res.layoutParameters,
      barcodeData: res.barcodeData,
      imageData: res.imageData,
      printingData: res.printingData,
      questionsWindowParameters: res.questionsWindowParameters,
      skewMarksWindowParameters: res.skewMarksWindowParameters,
      formFieldWindowParameters: res.formFieldWindowParameters,
    };

    console.log(fullRequestData);

    // Create the template
    const resCRA = await createTemplate(fullRequestData);
    console.log(resCRA);
    if (resCRA.success === true) {
      const layoutId = resCRA?.layoutId;
      const formdata = new FormData();
      formdata.append("LayoutId", layoutId);
      formdata.append("FrontImageFile", frontImgfile);
      formdata.append("BackImageFile", backImgfile);
      formdata.append("ExcelFile", csvfile);

      // Send the files
      const res2 = await sendFile(formdata);
      console.log(res2)
      if (res2.success) {
        return "Template Cloned Successfully";
      }else{
        return "Error Occurred while cloning";
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert(
      "An error occurred while processing the template. Please try again later."
    );
  }
};

export default CloneTemplateHandler;
