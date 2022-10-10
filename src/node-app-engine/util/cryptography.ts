import { randomBytes, pbkdf2 } from "crypto";
import { Config } from "../constants/config";
import { sign, verify, VerifyErrors, decode } from 'jsonwebtoken';

/**
 * 
 * @param length number of characters
 * @param expiry number seconds until expiration
 * @returns {code: string, expiry: number}
 */
export const createSecurityCode = (length: number = Config.crypto.SecurityCodeLength, expiry: number = Config.crypto.SecurityCodeExpiry): {code: string, expiry: Date} => {
    const bytes = Math.ceil(length / 2);
    const code = randomBytes(bytes).toString('hex');
    const now = new Date();
    const expiryTime = new Date((now.getTime() + expiry));
    return {
        code: code,
        expiry: expiryTime
    };
};

export const createSalt = (length: number = Config.crypto.PasswordSaltLength): string => {
    const bytes = Math.ceil(length / 2);
    return randomBytes(bytes).toString('hex');
};

export const createJwt = (payload: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        sign(
            {
                data: payload,
                exp: Math.floor(Date.now() / 1000) + Config.crypto.JwtExpiry
            }, 
            Config.crypto.JwtSecret, 
            {
                issuer: Config.crypto.JwtIssuer
            }, (err, signature) => {
                if (err) {
                    reject(err.message);
                } 
                else {
                    resolve(signature);
                }
            }
        );
    });
};

export const securePassword = (plainText: string, salt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        pbkdf2(
            plainText, 
            salt, 
            Config.crypto.PasswordHashIterations, 
            Config.crypto.PasswordKeyLength, 
            'sha512',
            (err, key: Buffer) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(key.toString('hex'));
                }
            }
        );
    });
};

export const validateJwt = async<T>(jwt: string): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        verify(
            jwt, 
            Config.crypto.JwtSecret, 
            {
                issuer: Config.crypto.JwtIssuer
            }, 
            (err: VerifyErrors, decoded: T) => {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve((decoded as any).data);
                }
            }
        );
    });
};

export const decodeJwt = <T>(jwt: string): T => {
    return decode(jwt, {json: true}) as T;
};