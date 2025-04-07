import { supabase } from '../utils/supabaseClient';

export const useAuth = () => {
  const signInWithEmail = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return user;
  };

  const signInWithGoogle = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
    return user;
  };

  const signInWithFacebook = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
    if (error) throw error;
    return user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };
};