// config/ApiConfig.js

import getBaseUrl from "services/BackendApi";

const initializeUrls = async () => {
  const baseUrl = await getBaseUrl();
  console.log(baseUrl);
  return {
    CREATE_USER: `${baseUrl}UserRegistration`,
    UPDATE_USER: `${baseUrl}UpdateUser`,
    GET_USERS: `${baseUrl}GetUsers`,
    LOGIN: `${baseUrl}Login`,
    DELETE_USER: `${baseUrl}DeleteUser?Id=`,
    GET_USER_ROLES: `${baseUrl}GetUserRole`,
    GET_PROCESS_DATA: `${baseUrl}ProcessData`,
    SCAN_FILES: `${baseUrl}ScanFiles`,
    REFRESH_SCANNER: `${baseUrl}RefreshScanner`,
    GET_PROCESS_24_PAGE_DATA: `${baseUrl}Process_24_Page_Booklet_Data`,
    SCAN_24_PAGE_FILES: `${baseUrl}Scan_24_Page_Booklet`,
    GET_PROCESS_32_PAGE_DATA: `${baseUrl}ProcessData`,
    SCAN_32_PAGE_FILES: `${baseUrl}Scan_32_Page_Booklet`,
    GET_ALL_TEMPLATE: `${baseUrl}GetAllLayout`,
    GET_LAYOUT_DATA: `${baseUrl}GetLayoutDataById`,
    CREATE_TEMPLATE: `${baseUrl}LayoutSetting`,
    SEND_FILE: `${baseUrl}SaveLayoutFiles`,
    DELETE_TEMPLATE: `${baseUrl}DeleteLayout`,
    CHECK_DELETE_TEMPLATE: `${baseUrl}GetJobStatus`,
    GET_TEMPLATE_IMAGE: `${baseUrl}GetTemplateImage`,
    GET_TEMPLATE_CSV: `${baseUrl}GetTemplateCSV`,
    CANCEL_SCAN: `${baseUrl}CancelScan`,
    GENERATE_EXCEL: `${baseUrl}GenerateExcelFile`,
    CREATE_JOB: `${baseUrl}CreateJobs`,
    GET_ALL_JOBS: `${baseUrl}GetAllJobs`,
    DELETE_JOB: `${baseUrl}DeleteJob`,
    GET_JOB_DETAIL: `${baseUrl}GetJobById`,
    ASSIGN_JOB: `${baseUrl}AssignJob`,
    GET_ASSIGNED_JOB: `${baseUrl}GetJobQueueList`,
    GET_SCANNED_IMAGE: `${baseUrl}GetSampleData`,
    GET_JOB_COUNT: `${baseUrl}GetTotalJobCount`,
    START_JOB: `${baseUrl}StartJob`,
    FINISH_JOB: `${baseUrl}FinishJob`,
    UPDATE_JOB: `${baseUrl}UpdateJobs`,
    CHECK_PRINT: `${baseUrl}CheckPrintOption`,
    PRINT_DATA: `${baseUrl}PrintSetting`,
    GET_ROW_DATA: `${baseUrl}GetDataByRowRange`,
    GET_TOTAL_EXCEL_ROW: `${baseUrl}GetTotalExcelRow`,
    MAIN_URL: baseUrl,
  };
};

export default initializeUrls;
