import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test.describe('REST Countries API Tests', () => {
  test.beforeEach(async () => {
    allure.epic('REST Countries API');
    allure.feature('Country Information API');
  });

  test('should get all countries', async ({ request }) => {
    allure.story('Get All Countries');
    allure.severity('critical');
    allure.description('Test to verify that we can retrieve all countries from the API');

    const response = await request.get('https://restcountries.com/v3.1/all');
    
    expect(response.status()).toBe(200);
    
    const countries = await response.json();
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
    
    // Verify country structure
    const firstCountry = countries[0];
    expect(firstCountry).toHaveProperty('name');
    expect(firstCountry).toHaveProperty('capital');
    expect(firstCountry).toHaveProperty('population');
    expect(firstCountry).toHaveProperty('area');
  });

  test('should get country by name', async ({ request }) => {
    allure.story('Get Country by Name');
    allure.severity('high');
    allure.description('Test to verify retrieving a specific country by its name');

    const countryName = 'United States';
    const response = await request.get(`https://restcountries.com/v3.1/name/${countryName}`);
    
    expect(response.status()).toBe(200);
    
    const countries = await response.json();
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
    
    const country = countries[0];
    expect(country.name.common).toContain('United States');
  });

  test('should get country by code', async ({ request }) => {
    allure.story('Get Country by Code');
    allure.severity('high');
    allure.description('Test to verify retrieving a specific country by its country code');

    const countryCode = 'USA';
    const response = await request.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    
    expect(response.status()).toBe(200);
    
    const country = await response.json();
    expect(country.name.common).toContain('United States');
    expect(country.cca3).toBe(countryCode);
  });

  test('should get countries by region', async ({ request }) => {
    allure.story('Get Countries by Region');
    allure.severity('medium');
    allure.description('Test to verify retrieving countries filtered by region');

    const region = 'Europe';
    const response = await request.get(`https://restcountries.com/v3.1/region/${region}`);
    
    expect(response.status()).toBe(200);
    
    const countries = await response.json();
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
    
    // Verify all countries are from the specified region
    countries.forEach(country => {
      expect(country.region).toBe(region);
    });
  });

  test('should get countries by capital', async ({ request }) => {
    allure.story('Get Countries by Capital');
    allure.severity('medium');
    allure.description('Test to verify retrieving countries filtered by capital city');

    const capital = 'London';
    const response = await request.get(`https://restcountries.com/v3.1/capital/${capital}`);
    
    expect(response.status()).toBe(200);
    
    const countries = await response.json();
    expect(Array.isArray(countries)).toBe(true);
    expect(countries.length).toBeGreaterThan(0);
    
    // Verify the capital matches
    const country = countries[0];
    expect(country.capital).toContain(capital);
  });

  test('should validate country data structure', async ({ request }) => {
    allure.story('Validate Country Data Structure');
    allure.severity('medium');
    allure.description('Test to verify that country data has the expected structure');

    const response = await request.get('https://restcountries.com/v3.1/name/Canada');
    
    expect(response.status()).toBe(200);
    
    const countries = await response.json();
    const country = countries[0];
    
    // Verify required fields
    expect(country).toHaveProperty('name');
    expect(country).toHaveProperty('capital');
    expect(country).toHaveProperty('population');
    expect(country).toHaveProperty('area');
    expect(country).toHaveProperty('region');
    expect(country).toHaveProperty('subregion');
    expect(country).toHaveProperty('languages');
    expect(country).toHaveProperty('currencies');
    
    // Verify data types
    expect(typeof country.population).toBe('number');
    expect(typeof country.area).toBe('number');
    expect(Array.isArray(country.capital)).toBe(true);
  });

  test('should handle invalid country name', async ({ request }) => {
    allure.story('Handle Invalid Country Name');
    allure.severity('low');
    allure.description('Test to verify API behavior when requesting a non-existent country');

    const response = await request.get('https://restcountries.com/v3.1/name/NonExistentCountry123');
    
    expect(response.status()).toBe(404);
  });

  test('should get countries with specific fields', async ({ request }) => {
    allure.story('Get Countries with Specific Fields');
    allure.severity('low');
    allure.description('Test to verify retrieving countries with only specific fields');

    const fields = 'name,capital,population';
    const response = await request.get(`https://restcountries.com/v3.1/all?fields=${fields}`);
    
    expect(response.status()).toBe(200);
    
    const countries = await response.json();
    const country = countries[0];
    
    // Verify only requested fields are present
    expect(country).toHaveProperty('name');
    expect(country).toHaveProperty('capital');
    expect(country).toHaveProperty('population');
    
    // Verify other fields are not present
    expect(country).not.toHaveProperty('area');
    expect(country).not.toHaveProperty('region');
  });
});
