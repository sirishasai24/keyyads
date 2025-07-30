import { NextRequest,NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import Plan from "@/models/planModel";
connectDb();

export async function GET(request:NextRequest){
    try{
        const userId=await getDataFromToken(request);
    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status:401});
    }
    const user=await User.findById(userId);
    if(!user){
        return NextResponse.json({error:"User not found"}, {status:404});
    }
    const plan=await Plan.findOne({userId:userId});
    if(!plan){
        return NextResponse.json({message:"No plan found for this user",user},{status:200 });
    }
    return NextResponse.json({plan,user}, {status:200} );
    }
    catch(err){
        return NextResponse.json({ error: "Internal Server Error" ,err}, { status: 500 });
    }
}   
