//#region  mst notes
export const GET_NOTES__DETAILS_URL = "/notes/notes-details";
export const ADD_UPDATE_NOTES_URL = "/notes/add-update";
//#endregion

//#region File storage
export const ADD_FOLDER_URL = "/file-storage/add-folder";
export const GET_FOLDER_LIST_URL = "/file-storage/get-folder-list";
export const GET_FOLDER_ITEMS_URL = "/file-storage/get-folder-items";
export const UPLOAD_STORAGE_FILE_URL = "/file-storage/upload-file";
export const DELETE_STORAGE_FILE_URL = "/file-storage/delete-file-from-database";
export const DELETE_FOLDER_AND_CHILDRENS_STORAGE_FILE_URL = "/file-storage/delete-folder";
export const GET_STORAGE_MST_CATEGORY_URL = "/file-storage/get-mst-file-storage-category";
export const GET_ALL_FILES_BY_CATEGORY_ID_URL = "/file-storage/all-file-by-category-id";

// #endregion

// #region Reports
export const GET_USER_DASHBOARD_REPORTS_URL = "/reports/user/dashboard";

// #endregion

//#region Events
export const ADD_EVENT_URL = "/events/add-event";
export const GET_EVENTS_URL = "/events/get-events";
export const DELETE_EVENT_URL = "/events/delete-event";

// #endregion

//#region common
export const CHECK_SERVER_NETWORK = "/network/check";
export const ADD_USER_URL = "/user/add";
export const UPDATE_USER_PROFILE_URL = "/user/update-profile";
export const LOGIN_USER_URL = "/user/login";
export const GET_ALL_USERS_URL = "/user/get-all-users";
export const FILE_UPLOAD_URL = "/upload-files";
export const DELETE_FILE_URL = "/delete-files";

//#region  Workspaces
export const ADD_WORKSPACE_URL = "workspace/add-workspace";
export const GET_WORKSPACES_LIST_URL = "workspace/get-workspaces-list";
export const GET_WORKSPACE_FULL_DETAILS_BY_ID_URL =
  "workspace/get-workspace-details";
export const ADD_WORKSPACE_TASK_URL = "workspace/add-workspace-task";
export const UPDATE_WORKSPACE_TASK_POSITION_URL =
  "workspace/update-workspace-task-position";
export const DELETE_WORKSPACE_URL = "workspace/delete-workspace";
export const DELETE_WORKSPACE_TASK_URL = "workspace/delete-workspace-task";
export const RENAME_WORKSPACE_URL = "workspace/rename-workspace";
export const MOVE_WORKSPACE_TO_PUBLIC_URL =
  "workspace/move-workspace-to-public";

// #endregion

//#endregion

//#region  mst note
export const DELETE_MST_NOTE_URL = "/mst-note/delete";
export const GET_MST_NOTE_URL = "/mst-note/list";
export const RENAME_MST_NOTE_URL = "/mst-note/rename";
export const ADD_MST_NOTE_URL = "/mst-note/add";
export const MAKE_NOTE_PUBLIC_URL = "/mst-note/make-note-public";
export const CHANGE_COVER_ICON_MST_NOTE_URL = "/mst-note/change-cover-icon";
export const REMOVE_COVER_ICON_MST_NOTE_URL = "/mst-note/remove-cover-icon";
export const CHANGE_COVER_IMAGE_MST_NOTE_URL = "/mst-note/change-cover-image";
export const REMOVE_COVER_IMAGE_MST_NOTE_URL = "/mst-note/remove-cover-image";
export const INVITE_USER_IN_PRIVATE_NOTE_URL = "/mst-note/invite-user";
export const INVITE_USER_NOTE_INVITE_NOTIFICATIONS_URL =
  "/mst-note/get-note-invit-notifications";
export const INVITE_USER_NOTE_ACCEPT_REJECT_URL =
  "/mst-note/accept-reject-note-invitation";
//#endregion

//#region sub pages
export const ADD_SUB_PAGE_DETAILS_URL = "/sub-page/add-sub-page";
export const RENAME_SUB_PAGE_TITLE_URL = "/sub-page/rename";
export const REMOVE_COVER_ICON_SUB_PAGE_URL = "/sub-page/remove-cover-icon";
export const CHANGE_COVER_ICON_SUB_PAGE_URL = "/sub-page/change-cover-icon";
export const CHANGE_COVER_IMAGE_SUB_PAGE_URL = "/sub-page/change-cover-image";
export const REMOVE_COVER_IMAGE_SUB_PAGE_URL = "/sub-page/remove-cover-image";

//#endregion
