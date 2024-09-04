export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = 'api/auth';

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;

export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;

export const FORGOT_PASSWORD_ROUTE = `${AUTH_ROUTES}/forgot-password`;
export const RESET_PASSWORD_ROUTE = `${AUTH_ROUTES}/reset-password`;

export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;

export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;

export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

// Contact Routes
export const CONTACTS_ROUTES = `api/contacts`;

export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`;
export const SEARCH_GROUP_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search-contacts`;
export const GET__CHAT_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-chat-contacts`;
export const GET__ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-all-contacts`;

// GET ALL MESSAGES ROUTES
export const MESSAGES_ROUTES = `api/messages`;

export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILES_ROUTE = `${MESSAGES_ROUTES}/upload-file`;
export const UNSEND_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/unsend-messages`;

// Grouo Routes
export const GROUP_ROUTES = `api/groups`;

export const CREATE_GROUP_ROUTE = `${GROUP_ROUTES}/create-group`;
export const GET_USER_GROUP_ROUTE = `${GROUP_ROUTES}/get-user-group`;
export const GET_GROUP_MESSAGES_ROUTE = `${GROUP_ROUTES}/get-group-messages`;
export const EDIT_GROUT_INFO_ROUTE = `${GROUP_ROUTES}/edit-group-info`;
