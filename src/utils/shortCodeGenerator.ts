
import crypto from "crypto"
import prisma from "../db/prisma.js";
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export const generateShortCode = async(length= 6 , maxlength= 10): Promise<string>=>{
    let attempts = 0;
    const maxattempts = 10
 
while(attempts <maxattempts){
    let shortCode = ''
    const randomBytes = crypto.randomBytes(length)

    for(let i = 0; i<length; i++){
        shortCode += CHARSET[randomBytes[i]! % CHARSET.length]
    }
    const existing = await prisma.url.findFirst({
        where:{shortCode}
    })
    if(!existing){
        return shortCode
    }

    attempts++
}

return generateShortCode(length + 1, maxlength);
}

export const  isValidShortCode = (code: string): boolean =>{
    return /^[A-Za-z0-9]{4,12}$/.test(code);
}