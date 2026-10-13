import { supabase, isSupabaseConfigured } from './supabaseClient';

const AUTH_KEY = 'faneelo_admin_session_v1';
const ADMIN_CREDENTIALS_KEY = 'faneelo_admin_credentials_v1';

export const getDemoCredentials = () => {
  try {
    const saved = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return {
    email: 'admin@faneelo.co.uk',
    password: 'admin123'
  };
};

export const setDemoCredentials = (email, password) => {
  try {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify({ email, password }));
    return true;
  } catch {
    return false;
  }
};

export async function login(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // Try Supabase Auth if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (!error && data?.session) {
        const session = {
          user: data.user,
          token: data.session.access_token,
          type: 'supabase',
          expiresAt: data.session.expires_at
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        return { success: true, session };
      }
      if (error) {
        console.warn('Supabase login returned error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase login failed, checking local credentials:', e);
    }
  }

  // Fallback demo credentials check
  const creds = getDemoCredentials();
  if (
    cleanEmail === creds.email.toLowerCase() &&
    password === creds.password
  ) {
    const session = {
      user: {
        id: 'admin_local_1',
        email: creds.email,
        role: 'Administrator',
        name: 'Faneelo Store Admin'
      },
      type: 'local',
      token: 'local_token_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  return { 
    success: false, 
    error: 'Invalid email or password. Please check your credentials.' 
  };
}

export async function logout() {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
  }
  localStorage.removeItem(AUTH_KEY);
  return true;
}

export function getCurrentSession() {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentSession());
}
