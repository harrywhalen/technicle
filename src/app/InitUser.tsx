'use client';

import { useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function InitUser() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const creation = new Date(user.metadata.creationTime ?? 0).getTime();
        const lastSignIn = new Date(user.metadata.lastSignInTime ?? 0).getTime();

        const isNewUser = creation === lastSignIn;

        if (isNewUser) {
          await fetch('/api/saveUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: user.uid,
              createdAt: user.metadata.creationTime
            })
          });
        }
      } else {
        await signInAnonymously(auth);
      }
    });

    return () => unsub();
  }, []);

  return null;
}
