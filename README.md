# CabGo — Cab Ride Booking Prototype

A responsive, front-end cab booking prototype for a college project, built with plain HTML, CSS, and JavaScript.

## Project files

- `index.html` — booking page and confirmation dialog
- `style.css` — responsive layout, components, and styling
- `script.js` — fare estimates, ride selection, form validation, and booking history

## Run locally

1. Download or clone this repository.
2. Open the `cab-ride-prototype` folder.
3. Double-click `index.html` to open it in a modern browser.

You can also open the repository in Visual Studio Code and use the Live Server extension.

## Features

- Pickup and destination inputs with basic validation
- Five ride categories: Bike, Auto, Mini, Sedan, and SUV
- Adjustable trip distance from 1 to 40 km
- Automatic sample fare estimates for every ride type
- Booking confirmation dialog with a demo booking ID
- Recent bookings, remove-one, and clear-history controls
- Local browser storage using `localStorage`
- Responsive desktop and mobile layout
- No paid API keys or backend required

## Fare formula

The prototype uses sample rates for demonstration:

`Estimated fare = base fare + (distance in km × rate per km)`

The values are illustrative and are not live market prices.

## Publish with GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)` if you want to publish the repository root.

Because the prototype files are inside `cab-ride-prototype/`, the project URL will generally be:

`https://24pa1a05h7-prog.github.io/FSD-2/cab-ride-prototype/`

GitHub Pages must be enabled for the repository. If the repository root already hosts another site, publishing this subfolder does not replace its files, but the folder itself must be included in the published branch.

## Important limitations

This is a front-end demonstration only. It does not connect to real drivers, GPS, route distance services, maps, payment gateways, SMS, or a dispatch backend. Bookings are saved only in the current browser and are not shared across devices.
