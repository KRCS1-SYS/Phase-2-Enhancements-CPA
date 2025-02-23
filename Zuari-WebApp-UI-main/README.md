Zuari-WebApp-UI

Zuari-WebApp-UI is a dynamic and interactive web application designed to provide real-time data visualization and management for Zuari Industries. Built with React, TypeScript, and Vite, the application leverages modern web technologies to deliver a seamless user experience with responsive design and robust functionality.

Table of Contents
• Features
• Technologies Used
• Getting Started
• Prerequisites
• Installation
• Running the Application
• Building for Production
• Project Structure
• License
• Contact

Features
• Interactive Charts: Visualize data with zoomable and expandable X-axes down to minute-level granularity using Recharts.
• Custom Legends: Clearly distinguish between main data lines and reference lines with custom legends.
• Responsive Design: Optimized for various screen sizes and devices for an optimal user experience.
• Accordion Panels: Organize content efficiently with expandable accordion components.
• Custom UI Components: Reusable and styled components like JumboIconButton for consistent UI elements.
• Fullscreen Mode: Enhance data visualization by toggling charts to fullscreen.
• Real-time Data Handling: Efficiently manage and display large datasets with performance optimizations.

Technologies Used
• React: Frontend library for building user interfaces.
• TypeScript: Superset of JavaScript for static type checking.
• Vite: Fast frontend build tool for a streamlined development experience.
• Recharts: Charting library built with React for data visualization.
• Material-UI (MUI): React UI framework for implementing responsive designs.
• Emotion: CSS-in-JS library for styling components.
• Lodash: Utility library for JavaScript, used here for debouncing functions.

Getting Started

Prerequisites

Ensure you have the following installed on your machine:
• Node.js: Version 14 or above. Download Node.js
• npm or Yarn: Package manager for JavaScript.

Installation 1. Install Dependencies
Using npm:

npm install

Or using Yarn:

yarn install

Running the Application

To start the development server with hot module replacement:

Using npm:

npm run dev

Using Yarn:

yarn dev

Open your browser and navigate to http://localhost:3000 to view the application.

Building for Production

To build the application for production:

Using npm:

npm run build

Using Yarn:

yarn build

The optimized and minified files will be generated in the dist directory.

Previewing the Production Build

To preview the production build locally:

Using npm:

npm run preview

Using Yarn:

yarn preview

Project Structure

zuari-webapp-ui/
├── public/
│ └── assets/
│ └── images/
│ ├── zuari-logo.png
│ └── logo.svg
├── src/
│ ├── app/
│ │ └── \_components/
│ │ ├── Accordion/
│ │ │ └── Accordion.jsx
│ │ ├── ParameterList/
│ │ └── ...
│ ├── @jumbo/
│ │ └── components/
│ │ ├── JumboIconButton/
│ │ │ └── JumboIconButton.jsx
│ │ └── ...
│ ├── components/
│ │ ├── SimpleLineChart/
│ │ │ └── SimpleLineChart.jsx
│ │ └── ...
│ ├── hooks/
│ ├── utils/
│ ├── App.jsx
│ ├── main.jsx
│ └── ...
├── .eslintrc.js
├── tsconfig.json
├── vite.config.js
├── package.json
└── README.md

License

This project is licensed under the MIT License.

Contact

For any inquiries or support, please contact:
• Company: KGT Solutions
• Website: https://www.kgt.solutions

This project is developed and maintained by KGT Solutions. For more information, visit the KGT Solutions website.
