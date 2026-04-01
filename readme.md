# 7Timer Weather Forecast Project

## Project Link

GitHub Repository: [Weather-App](https://github.com/PolaAAmin/Weather-App)

## Explanation of My Solution

This project is a weather forecast website built with HTML, CSS, Bootstrap, and JavaScript. It uses the 7Timer API to display forecast data for selected European cities. Users can choose a city from a dropdown menu, and the website then loads forecast cards showing temperature, wind speed, wind direction, and a matching weather icon.

To support city selection, I used a local CSV file containing city coordinates. After the user selects a city, the app reads the correct latitude and longitude, sends a request to the API, and renders the returned forecast data dynamically on the page.

## Description of My Approach

My approach focused on building a simple and clear user flow:

1. Create a landing section with a strong visual header and a direct link to the API documentation.
2. Load city data from a CSV file and generate the dropdown options dynamically instead of hardcoding every city.
3. Fetch forecast data only after the user selects a city, which keeps the page lightweight on initial load.
4. Present the forecast results as responsive cards so the layout works across different screen sizes.
5. Add weather icons and loading feedback to make the interface easier to understand and more engaging.

I also separated the logic into small functions such as loading city data, fetching the forecast, generating result cards, and selecting weather icons. This made the code easier to read, maintain, and improve later.

## What Makes This Project Stand Out

- Dynamic city selection based on CSV data
- API-driven forecast rendering with JavaScript
- Responsive Bootstrap layout
- Clear visual feedback with icons and loading state
- Practical use of external data, DOM updates, and asynchronous requests
