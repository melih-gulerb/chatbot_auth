import {BusinessError} from "../models/errors/base";

export class AuthenticationValidator {
    public static ValidateRegisterUser(email: string, password: string): { error: BusinessError | null } {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return { error: new BusinessError('Invalid email format', 400) };
        }

        if (password.length < 8) {
            return { error: new BusinessError('Password must be at least 8 characters long', 400) };
        }

        return { error: null };
    }
}