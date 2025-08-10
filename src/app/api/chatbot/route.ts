import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/dbConfig/dbConfig";
import Property from "@/models/propertyModel";
import Together from "together-ai";

connectDb();

const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY,
});

// Define a type-safe interface for the query object
interface PropertyQuery {
    transactionType?: string;
    type?: string;
    'location.city'?: { $regex: RegExp };
    bedrooms?: string;
    price?: { $lte: number };
}

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // --- Step 1: Pre-process the user's query to search your database ---
        const keywords = message.toLowerCase().split(/\s+/);
        const query: PropertyQuery = {};

        if (keywords.includes('rent')) {
            query.transactionType = 'rent';
        } else if (keywords.includes('sale') || keywords.includes('buy')) {
            query.transactionType = 'sale';
        }
        if (keywords.includes('apartment') || keywords.includes('house') || keywords.includes('home') || keywords.includes('building')) {
            query.type = 'building';
        } else if (keywords.includes('land') || keywords.includes('plot')) {
            query.type = 'land';
        }
        
        const locationMatch = message.match(/in\s+([a-zA-Z]+)/i);
        if (locationMatch && locationMatch[1]) {
            query['location.city'] = { $regex: new RegExp(`^${locationMatch[1]}`, 'i') };
        }

        const bedroomMatch = message.match(/(\d)\s?bhk/i);
        if (bedroomMatch && bedroomMatch[1]) {
            query.bedrooms = bedroomMatch[1];
        }

        const priceMatch = message.match(/(?:under|below|max\s+price)\s+\$?([\d,.]+)/i);
        if (priceMatch && priceMatch[1]) {
            const priceValue = parseFloat(priceMatch[1].replace(/,/g, ''));
            query.price = { $lte: priceValue };
        }

        // --- Step 2: Query your database for relevant properties using aggregation pipeline for randomization ---
        const relevantProperties = await Property.aggregate([
            { $match: query }, // Filter documents based on the parsed query
            { $sample: { size: 3 } }, // Randomly select 3 documents from the filtered set
            { $project: { // Select the required fields
                title: 1,
                address: 1,
                price: 1,
                transactionType: 1,
                bedrooms: 1,
                bathrooms: 1,
                area: 1,
                areaUnit: 1,
                images: 1,
            }}
        ]);

        // --- Step 3: Format the data for the AI model's prompt ---
        let promptMessage = `You are a helpful real estate chatbot for Keyyards. The user's query is: "${message}".\n`;

        if (relevantProperties.length > 0) {
            promptMessage += `\nBased on my database, here are some relevant properties. Use this data to formulate a friendly and professional response that summarizes the results and offers more help. Do not mention that you're using my database directly. Always include the price and address of each property. Do not make up any information outside of what is provided. The links will be rendered as clickable URLs on the website, so please format them as simple text.\n`;
            relevantProperties.forEach((prop, index) => {
                promptMessage += `\nProperty ${index + 1}:\n`;
                promptMessage += `- Title: ${prop.title}\n`;
                promptMessage += `- Address: ${prop.address}\n`;
                promptMessage += `- Price: ₹${prop.price.toLocaleString()}\n`;
                promptMessage += `- Type: ${prop.bedrooms ? `${prop.bedrooms} BHK ` : ''}${prop.type}\n`;
                promptMessage += `- Link: /property/${prop._id}\n`;
            });
            promptMessage += `\nwebsite URL: https://keyyards.in\n`;
            promptMessage += `\nEnd of data. Now, generate your professional response.`;
        } else {
            promptMessage += `\nI searched my database and found no properties matching the criteria "${message}". Please respond in a helpful, conversational tone, and ask the user to try a different query.`;
        }

        // --- Step 4: Call the Together AI API ---
        const response = await together.chat.completions.create({
            model: "meta-llama/Llama-3-8b-chat-hf",
            messages: [
                {
                    role: "system",
                    content: "You are a real estate assistant for Keyyards. Your goal is to help users find properties and engage them in a helpful, professional manner. You will be given a user query and relevant data from the database. Your response should be friendly, professional, and concise."
                },
                {
                    role: "user",
                    content: promptMessage,
                }
            ],
            temperature: 0.7,
            max_tokens: 250,
        });

        const aiResponse = response.choices && response.choices[0] && response.choices[0].message
            ? response.choices[0].message.content
            : "Sorry, I couldn't generate a response at this time.";

        return NextResponse.json({ aiResponse }, { status: 200 });

    } catch (error) {
        console.error("Error in Together AI chatbot:", error);
        return NextResponse.json({ error: "Failed to generate a response from the chatbot" }, { status: 500 });
    }
}