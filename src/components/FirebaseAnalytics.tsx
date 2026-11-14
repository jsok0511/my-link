"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase";

/**
 * Initializes Firebase Analytics once on client mount.
 */
export function FirebaseAnalytics() {
  useEffect(() => {
    void getFirebaseAnalytics();
  }, []);

  return null;
}
