import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse,NextRequest } from "next/server";
import User from "@/models/userModel"
import {connectDb} from '@/dbConfig/dbConfig'
connectDb();

export async function GET(request:NextRequest) {
    
    try {
        
        const userId=await getDataFromToken(request);
        const user=await User.findOne({_id:userId}).select("-password");
        return NextResponse.json({
            message:"User Found",
            user:user
        })

    } catch (error) {
        return NextResponse.json({error:error},
            {status:400});
    }

}
