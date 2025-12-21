import jwt from "jsonwebtoken"
export const generateTOKEN = (userID: String)=>{
    try{
        const secret = process.env.JWT_SECRET
        if(!secret){
            throw new Error("JWT secret is not defined")

        }
        return jwt.sign({userID}, secret )

    }
    catch(err:any) {
        console.log("error in toekn generation" , err);
        throw new Error("Token generation failed")
    }
} 