import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useRef, useState, useCallback } from "react";

const MAX_RETRIES = 3;

export function useCurrentUser() {
  const user = useQuery(api.users.currentUser);
  const ensureUser = useMutation(api.users.ensureUser);
  const hasEnsured = useRef(false);
  const retryCount = useRef(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user === null && !hasEnsured.current && retryCount.current < MAX_RETRIES) {
      hasEnsured.current = true;
      retryCount.current += 1;
      ensureUser().catch(() => {
        if (retryCount.current >= MAX_RETRIES) {
          setError("Unable to set up your account. Please try signing out and back in.");
        } else {
          hasEnsured.current = false;
        }
      });
    }
  }, [user, ensureUser]);

  const retry = useCallback(() => {
    retryCount.current = 0;
    hasEnsured.current = false;
    setError(null);
  }, []);

  return {
    user,
    isLoading: user === undefined || (user === null && !error),
    isAuthenticated: user !== null && user !== undefined,
    error,
    retry,
  };
}
