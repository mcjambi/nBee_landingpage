import { Button, LegacyCard } from '@shopify/polaris';
import { useAuth } from 'AuthContext';
import axios from 'axios';
import React from 'react';

export default function Homepage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <LegacyCard sectioned>
      <>Welcome {user?.display_name}</>
      <Button
        onClick={() =>
          axios
            .get('blabla')
            .then()
            .catch((e) => {})
        }
      >
        NÚT BẤM
      </Button>
    </LegacyCard>
  );
}
