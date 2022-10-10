export const Config = {

    crypto: {
        SecurityCodeLength: 6,
        SecurityCodeExpiry: 300, // Seconds
    
        JwtSecret: 'NotAVerySecureSecret',
        JwtExpiry: 60 * 60 * 24,
        JwtIssuer: 'tagandtrac',
        DecodedJwtKey: 'decodedJwt',
    
        PasswordSaltLength: 64,
        PasswordHashIterations: 1000,
        PasswordKeyLength: 64
    },

    database: {
        Postgres: {
            User: "apiuser",
            Password: "apipass",
            Database: "tgapi",
            Connection: "db",
            Port: 5432
        }
    },

    log: {
        LEVEL: 'info',
        OUTPUT_FILENAME: 'combined.log'
    },

    server: {
        Port: 8080,
        Name: "Node App Engine Boilerplate",
        terminationTimeout: 5000
    },

    files: {
        Disk: {
            TempDir: '/tmp/uploads',
            FieldName: 'files'
        },
        S3: {
            AccessKeyId: 'AKIAJLMYRU2N4XA2MNKA',
            SecretAccessKey: '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',
            Bucket: 'localincite-public-storage',
            ACL: 'public-read'
        }
    }

};