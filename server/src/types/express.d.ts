import { User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: User; // or a subset of User if that's what's in the token
        }
    }
}
