// config/ApiConfig.js

import getBaseUrl from "services/BackendApi";

const initializeUrls = async () => {
  const baseUrl = await getBaseUrl();
  console.log(baseUrl);
  return {
    CREATE_USER: `${baseUrl}api/userAuth/SignUp`,
    UPDATE_USER: `${baseUrl}UpdateUser`,
    GET_USERS: `${baseUrl}api/userAuth/GetList`,
    LOGIN: `${baseUrl}api/userAuth/LoginForm`,
    DELETE_USER: `${baseUrl}api/userAuth/DeleteEmp`,
    GET_USER_ROLES: `${baseUrl}GetUserRole`,
    GET_PROCESS_DATA: `${baseUrl}ProcessData`,
    SCAN_FILES: `${baseUrl}api/OmrProcessing/process-omr`,
    REFRESH_SCANNER: `${baseUrl}RefreshScanner`,
    GET_PROCESS_24_PAGE_DATA: `${baseUrl}Process_24_Page_Booklet_Data`,
    SCAN_24_PAGE_FILES: `${baseUrl}Scan_24_Page_Booklet`,
    GET_PROCESS_32_PAGE_DATA: `${baseUrl}ProcessData`,
    SCAN_32_PAGE_FILES: `${baseUrl}Scan_32_Page_Booklet`,
    GET_ALL_TEMPLATE: `${baseUrl}api/Template/List_ImeTemp`,
    GET_LAYOUT_DATA: `${baseUrl}api/Template/Single_ImeTem`,
    CREATE_TEMPLATE: `${baseUrl}api/Template/Create_ImeTemp`,
    UPDATE_TEMPLATE: `${baseUrl}api/Template/Update_ImeTemp`,
    PAUSE_SCAN: `${baseUrl}api/OmrProcessing/pause-processing`,
    RESUME_SCAN: `${baseUrl}api/OmrProcessing/resume-processing`,
    SEND_FILE: `${baseUrl}SaveLayoutFiles`,
    DELETE_TEMPLATE: `${baseUrl}api/Template/Del_ImeTemp`,
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
