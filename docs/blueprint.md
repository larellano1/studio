# **App Name**: ValuMaster

## Core Features:

- Data Input: Accept user input for company sector and country.
- Data Retrieval: Automatically retrieve risk-free rate (defaulting to 10-year average of 10-year T-Bond, with options for user choice), market return (10-year SP500 mean return), and unlevered beta (from Damodaran website, with country risk options defaulting to credit default price).
- CAPM Calculation: Calculate the expected return using the CAPM formula: Expected Return = Risk-Free Rate + Beta * (Market Return - Risk-Free Rate).
- Result Display: Display the calculated expected return in a clear and concise format.

## Style Guidelines:

- Primary color: Dark blue (#2c3e50) for a professional and trustworthy feel.
- Secondary color: Light gray (#ecf0f1) for clean backgrounds and text contrast.
- Accent: Teal (#3498db) for highlighting key information and interactive elements.
- Clean and organized layout with clear sections for input, data retrieval, and output.
- Subtle animations to indicate loading and calculation processes.
- Use simple and professional icons to represent different inputs and outputs.

## Original User Request:
I want to create a API that helps to build a valuation model for any company, using the CAPM.
  