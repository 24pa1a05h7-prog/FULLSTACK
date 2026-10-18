# RideLeaf — React Cab Booking Website

A responsive cab-booking college project built with **React, Vite, JavaScript, and CSS**.

## Features

- Responsive landing page and mobile navigation
- Pickup and destination inputs with swap control
- Adjustable distance estimator (1–40 km)
- Five ride choices: Bike, Auto, Mini, Sedan, and SUV
- Live fare estimates in Indian rupees
- Ride-now / plan-for-later selection
- Booking confirmation modal and generated demo reference
- Booking history stored in browser LocalStorage
- Remove individual bookings or clear the history
- Accessible form labels, feedback, and modal semantics

## Requirements

Install [Node.js](https://nodejs.org/) (LTS recommended). npm is included with Node.js.

## Run locally

Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production files are created in `dist/`.

## Deploy on GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds this folder and publishes the generated site. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the build and deployment source. Pushes to `main` will trigger deployment.

Expected website URL after the workflow succeeds:
https://24pa1a05h7-prog.github.io/FULLSTACK/

## Important project limitations

This is a front-end prototype. It does **not** connect to real drivers, live maps/GPS, a server, authentication, payment processing, or a dispatch system. Fares are illustrative estimates, and bookings are saved only in the current browser. A production service would need a secure backend, database, real mapping/distance API, authentication, driver operations, and payment integration.