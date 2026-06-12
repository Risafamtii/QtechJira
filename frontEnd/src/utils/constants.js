export const ROLES = {
  ADMIN: 'Admin',
  AGENT: 'Agent',
  USER: 'User',
};

// Roles an admin may assign through user management.
export const ASSIGNABLE_ROLES = [ROLES.AGENT, ROLES.USER];

export const TOKEN_KEY = 'tms_token';
export const USER_KEY = 'tms_user';
