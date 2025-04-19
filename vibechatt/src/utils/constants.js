export const HOST = import.meta.env.VITE_SERVER_URL

const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GETUSER_INFO = `${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`
export const SET_PROFILE_IMAGE = `${AUTH_ROUTES}/set-profile-image`
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`
export const LOGOUT = `${AUTH_ROUTES}/logout`;

const CONTACT_ROUTES = `api/contacts`
export const SEARCH_CONTACT = `${CONTACT_ROUTES}/search`
export const GET_ALL_CONTACTS = `${CONTACT_ROUTES}/get-all-contacts`
export const GET_ALL_CONTACTS_FOR_CHANNEL = `${CONTACT_ROUTES}/get-contacts-for-channel`

const MESSAGE_ROUTES = "api/messages";
export const GET_CHAT_MESSAGES = `${MESSAGE_ROUTES}/get-messages`
export const SEND_FILE_MSG = `${MESSAGE_ROUTES}/send-file`;


const CHANNEL_ROUTES = "api/channel";
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
export const GET_ALL_CHANNELS = `${CHANNEL_ROUTES}/get-user-channel`;
export const GET_CHANNEEL_MSG = `${CHANNEL_ROUTES}/get-channel-messages`