export interface SurveyData {
  happy: number;
  hopeful: number;
  pleasant: number;
  anxious: number;
  frustrated: number;
  sad: number;
}

export async function fetchSurveyData(): Promise<SurveyData> {
  const API_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbx4tpbzt6m2_elxyQBVtEjexsywJqGXsJbxgZGkDOO4emdu-j60G6yfTiUnIEkp0Et25A/exec";

  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();

    // Process the raw data to match our SurveyData interface
    const processedData: SurveyData = {
      happy: 0,
      hopeful: 0,
      pleasant: 0,
      anxious: 0,
      frustrated: 0,
      sad: 0,
    };

    rawData.forEach((entry: any) => {
      const mood = entry["How are you feeling today?"].toLowerCase();
      if (mood in processedData) {
        processedData[mood as keyof SurveyData]++;
      }
    });

    return processedData;
  } catch (error) {
    console.error("Error fetching survey data:", error);
    // Return default data in case of error
    return {
      happy: 0,
      hopeful: 0,
      pleasant: 0,
      anxious: 0,
      frustrated: 0,
      sad: 0,
    };
  }
}
