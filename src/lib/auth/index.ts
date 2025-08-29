import bcrypt from "bcrypt";
import crypto from "crypto";

export function createSequentialNumberGenerator(start: number = 1, max?: number) {
    let current = start;

    return function next(): number {
        if (max !== undefined && current > max) {
            throw new Error(`Sequence exhausted: exceeded max=${max}`);
        }
        const value = current;
        current += 1;
        return value;
    };
}

const nextUserSuffix = createSequentialNumberGenerator(1);

export function generateUsernameFromEmail(email: string): string {
    const atIndex = email.indexOf("@");
    if (atIndex <= 0) {
        throw new Error("Invalid email format");
    }

    const localPart = email.slice(0, atIndex);
    const suffix = nextUserSuffix();
    const userName = `${localPart}${suffix}`;
    return userName;
}

console.log(generateUsernameFromEmail("muhammad@gmail.com"));



export const generateVerificationCode = (): string => {
    return crypto.randomInt(100000, 999999).toString();
};

export const hashVerificationCode = async (code: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(code, saltRounds);
};
