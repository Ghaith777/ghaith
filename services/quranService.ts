import type { Surah, SurahDetail } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

interface SurahListResponse {
  code: number;
  status: string;
  data: Surah[];
}

interface SurahDetailResponse {
  code: number;
  status: string;
  data: SurahDetail;
}


export const getSurahList = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: SurahListResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch Surah list:', error);
    throw error;
  }
};

export const getSurahDetail = async (surahNumber: number): Promise<SurahDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: SurahDetailResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Failed to fetch details for Surah ${surahNumber}:`, error);
    throw error;
  }
};
