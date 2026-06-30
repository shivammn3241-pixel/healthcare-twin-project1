/**
 * Authentication Service for Healthcare Digital Twin (Username/Email + Password Redesign)
 * Prepares API integrations for Flask or FastAPI backend.
 * Uses localStorage as a mock database for demonstration.
 */

export interface RegisteredUser {
  name: string;
  username: string;
  email: string;
  passwordHash: string; // simple hash representation
}

export interface AuthSession {
  token: string;
  username: string;
  email: string;
  name: string;
}

const STORAGE_USERS_KEY = 'healthtwin_simple_users_db';
const STORAGE_SESSION_KEY = 'healthtwin_simple_active_session';

// Helper to simulate API call latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retrieve user DB
const getUsersDB = (): Record<string, RegisteredUser> => {
  const db = localStorage.getItem(STORAGE_USERS_KEY);
  return db ? JSON.parse(db) : {};
};

// Save user DB
const saveUsersDB = (db: Record<string, RegisteredUser>) => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(db));
};

export const authService = {
  /**
   * Register a new user
   */
  register: async (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string; user?: RegisteredUser }> => {
    await delay(800); // Simulate API latency

    const db = getUsersDB();
    const usernameKey = userData.username.toLowerCase().trim();
    const emailLower = userData.email.toLowerCase().trim();

    // Check if username or email is already taken
    if (db[usernameKey]) {
      return { success: false, message: 'This username is already registered.' };
    }

    // Check email uniqueness
    const emailExists = Object.values(db).some(u => u.email.toLowerCase() === emailLower);
    if (emailExists) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: RegisteredUser = {
      name: userData.name,
      username: usernameKey,
      email: emailLower,
      passwordHash: btoa(userData.password) // simple base64 mock hashing
    };

    db[usernameKey] = newUser;
    saveUsersDB(db);

    return {
      success: true,
      message: 'Secure account created successfully. Please login.',
      user: newUser
    };
  },

  /**
   * Login using Username or Email + Password
   */
  login: async (
    identifier: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; message: string; session?: AuthSession }> => {
    await delay(1000); // Simulate API verification latency

    const db = getUsersDB();
    const input = identifier.toLowerCase().trim();
    
    // Find user matching username or email
    let matchedUser: RegisteredUser | null = null;
    
    // Check by username
    if (db[input]) {
      matchedUser = db[input];
    } else {
      // Check by email
      matchedUser = Object.values(db).find(u => u.email.toLowerCase() === input) || null;
    }

    // Admin backup login
    if ((input === 'admin' || input === 'admin@healthcare.ai') && password === 'admin123') {
      const session: AuthSession = {
        token: 'mock-jwt-admin-simple-token',
        username: 'admin',
        email: 'admin@healthcare.ai',
        name: 'Dr. Sarah Connor (Admin)'
      };
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      return { success: true, message: 'Admin session authorized.', session };
    }

    if (!matchedUser || matchedUser.passwordHash !== btoa(password)) {
      return { success: false, message: 'Invalid clinical credentials or security key.' };
    }

    const session: AuthSession = {
      token: `mock-jwt-header.${btoa(JSON.stringify({ username: matchedUser.username, role: 'clinical-twin' }))}.mock-signature`,
      username: matchedUser.username,
      email: matchedUser.email,
      name: matchedUser.name
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));

    return {
      success: true,
      message: 'Workspace authenticated successfully.',
      session
    };
  },

  /**
   * Reset Password placeholder
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await delay(900);
    const emailLower = email.toLowerCase().trim();
    const db = getUsersDB();

    // Check if account with that email exists
    const userExists = Object.values(db).some(u => u.email === emailLower) || emailLower === 'admin@healthcare.ai';
    if (!userExists) {
      return { success: false, message: 'No registered clinician found under this email address.' };
    }

    return {
      success: true,
      message: 'Password reset link sent to your clinical email address.'
    };
  },

  /**
   * Fetch active session
   */
  getCurrentSession: (): AuthSession | null => {
    const session = localStorage.getItem(STORAGE_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  /**
   * Clear session
   */
  logout: () => {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }
};
