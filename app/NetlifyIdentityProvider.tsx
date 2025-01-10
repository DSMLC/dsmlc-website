"use client";

import { ReactNode, useEffect } from "react";
import { initNetlifyIdentity } from "./netlify_identity";

export default function NetlifyIdentityProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    initNetlifyIdentity();
  }, []);

  return <>{children}</>;
}
