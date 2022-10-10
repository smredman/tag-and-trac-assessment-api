import { PasswordCredential } from "../../models/password-credential.model";
import { createSalt, securePassword } from "../../node-app-engine/util/cryptography";

export const create = async(userId: string, plainTextPassword: string): Promise<PasswordCredential> => {
    const salt = createSalt();
    const password = await securePassword(plainTextPassword, salt);
    const pc =  PasswordCredential.create({
        password: password,
        salt: salt,
        userId: userId
    });
    return pc;
};

export const findByUserId = async(userId: string): Promise<PasswordCredential> => {
    const creds = await PasswordCredential.findOne({
        where: {
            userId: userId
        }
    });
    return creds;
};