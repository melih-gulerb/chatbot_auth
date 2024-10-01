import * as crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const ENCRYPTION_KEY = crypto.randomBytes(32)
const IV_LENGTH = 16

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string): string {
    const parts = text.split(':')
    const iv = Buffer.from(parts.shift()!, 'hex')
    const encryptedText = Buffer.from(parts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv)
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])

    return decrypted.toString()
}
