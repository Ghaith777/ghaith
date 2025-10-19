import { GoogleGenAI, Type } from "@google/genai";
import type { PrayerTimesData } from '../types';

export const getPrayerTimes = async (city: string, country: string): Promise<PrayerTimesData> => {
    try {
        // Fix: Per coding guidelines, API key must be from process.env.API_KEY.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const date = new Date().toISOString().split('T')[0];
        
        const prompt = `Provide the Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for ${city}, ${country} on ${date}. Also include the sunrise time (Shuruq). Return the response as a JSON object with keys: "fajr", "shuruq", "dhuhr", "asr", "maghrib", "isha". The time must be in 24-hour format HH:mm.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        fajr: { type: Type.STRING },
                        shuruq: { type: Type.STRING },
                        dhuhr: { type: Type.STRING },
                        asr: { type: Type.STRING },
                        maghrib: { type: Type.STRING },
                        isha: { type: Type.STRING },
                    },
                },
            },
        });
        
        const jsonString = response.text.trim();
        const prayerTimes = JSON.parse(jsonString) as PrayerTimesData;
        return prayerTimes;

    } catch (error) {
        console.error("Error fetching prayer times from Gemini API:", error);
        throw new Error("Failed to fetch prayer times. Please check your connection or API key.");
    }
};

export const getCityAndCountry = async (lat: number, lon: number): Promise<{ city: string; country: string }> => {
    try {
        // Fix: Per coding guidelines, API key must be from process.env.API_KEY.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on the latitude ${lat} and longitude ${lon}, what is the city and country? Return the response as a JSON object with keys "city" and "country". For example: {"city": "Riyadh", "country": "Saudi Arabia"}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        city: { type: Type.STRING },
                        country: { type: Type.STRING },
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const location = JSON.parse(jsonString);
        return location;

    } catch (error) {
        console.error("Error fetching location from Gemini API:", error);
        throw new Error("Failed to determine location from coordinates.");
    }
};
