'use client';

import {
  Auth,
  signInWithCredential,
  signOut as firebaseSignOut,
  PhoneAuthCredential,
} from 'firebase/auth';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { doc, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/**
 * Initiates a signInWithCredential operation.
 * Does not await the operation.
 */
export function signInNonBlocking(auth: Auth, credential: PhoneAuthCredential) {
  signInWithCredential(auth, credential).catch(error => {
    // This is a login error, not a permission error.
    // It will be caught by the component's try/catch.
    console.error('Sign in error', error);
  });
}

/**
 * Initiates a user creation operation in Firestore.
 * Does not await the operation.
 */
export function createUserProfileNonBlocking(
  db: Firestore,
  userId: string,
  mobileNumber: string
) {
  const userRef = doc(db, 'users', userId);
  const userData = {
    id: userId,
    mobileNumber: mobileNumber,
    createdAt: serverTimestamp(),
  };
  // Using merge: true to prevent overwriting if the document already exists.
  setDocumentNonBlocking(userRef, userData, { merge: true });
}

/**
 * Initiates a signOut operation.
 * Does not await the operation.
 */
export function signOutNonBlocking(auth: Auth) {
  firebaseSignOut(auth).catch(error => {
    console.error('Sign out error', error);
  });
}
