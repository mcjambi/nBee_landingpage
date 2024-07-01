import { Button, LegacyCard } from "@shopify/polaris";
import { useAuth } from "AuthContext";
import React from "react";

export default function Homepage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <LegacyCard sectioned>
      <>Welcome {user?.display_name}</>
      <Button onClick={() => alert("Button clicked!")}>NÚT BẤM</Button>
    </LegacyCard>
  );
}
