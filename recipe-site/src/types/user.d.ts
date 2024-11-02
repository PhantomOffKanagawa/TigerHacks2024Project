import { DocumentReference } from 'firebase/firestore';

export interface User {
  id: string;
  recipeRefs: DocumentReference[];
  // ... other user fields
}