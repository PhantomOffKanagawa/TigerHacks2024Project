import {
    User
} from '@/types/user.d';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const UserService = {
    getUser: async (userId: string): Promise<User> => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.data() as User;
    },
};
