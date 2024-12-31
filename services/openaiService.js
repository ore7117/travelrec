const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateItineraryForLocation = async (location, timing, likedDescriptions, budget, vacationType) => {
  const prompt = `
  You are a professional travel planner. Create a detailed ${timing}-day itinerary for a ${vacationType} trip to ${location}.
  
  The itinerary must include:
  1. **City Overview**: Provide a brief introduction to the city, highlighting its history, culture, and major attractions.
  2. **Daily Activities**: For each day, recommend morning, afternoon, and evening activities.
     - If it is a solo trip, focus on personalized experiences and opportunities for socializing.
     - If it is a group trip, recommend activities suitable for multiple people to enjoy together.
     - If it is a family trip, include child-friendly activities, family dining options, and relaxed schedules.
  3. **Budget Considerations**:
     - Provide **low-end**, **mid-range**, and **high-end** options for accommodations, dining, and activities to suit various preferences.
     - For accommodations:
       - Low-end: Hostels, budget hotels, or guesthouses.
       - Mid-range: Standard hotels or boutique accommodations.
       - High-end: Luxury hotels, resorts, or private rentals.
     - For dining:
       - Low-end: Local street food, diners, or budget-friendly cafes.
       - Mid-range: Casual restaurants offering local or international cuisine.
       - High-end: Fine dining establishments or Michelin-starred restaurants.
     - For activities:
       - Low-end: Free attractions, self-guided tours, or public parks.
       - Mid-range: Guided tours, museums, or small group excursions.
       - High-end: Private tours, exclusive experiences, or high-adrenaline activities.
  4. **Estimated Costs**: Provide a cost breakdown for each day, including accommodations, meals, and activities, with estimates for low, mid, and high-end options.
  5. **Overall Trip Cost**: Provide a total estimated cost for the ${timing}-day trip, including separate totals for low, mid, and high-end budgets.
  
  Ensure the itinerary is balanced with a mix of cultural experiences, dining, and relaxation tailored for a ${vacationType} trip.
  Highlight and incorporate the user's preferred locations (${likedDescriptions}) where applicable, and ensure they are included in the daily activities or recommendations.
  `;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',  // Ensure you're using the correct model
      messages: [
        { role: "system", content: "You are an expert travel planner who customizes itineraries based on user preferences and budget." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const itineraryText = response.choices[0].message.content;
    return itineraryText;
  } catch (error) {
    console.error('Error generating itinerary:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate itinerary');
  }
};

module.exports = { generateItineraryForLocation };
