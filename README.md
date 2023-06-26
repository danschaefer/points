# Customer Points by Month

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To Run This Project:

In the project directory, you can run:

### `npm start`

This will run the app in the development mode.\
It should automatically open your browser, but if it doesn't, you can view it by going here
[http://localhost:3000](http://localhost:3000).

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
The "Customer Points by Month" app can then be deployed!

# How to Run this Application
This application comes complete with "fake" data access to 1,000 data transactions that span from
January 1, 2022 to June 24, 2023. There are a total of 27 fake customers making random transactions
during that time frame.

To see a specific 3-month slice, select the starting month and year from the top panel, where it says,
"Select the start of the 3-month period to analyze." Notice that the "Go!" button is not active until
you've selected the start of the 3-month period (both year and month). After making that selection, hit
the "Go!" button, and after a slight delay (which simulates an async API call), the table below will
fill up with the requested data. Prior to hitting "Go!", you may notice that the table title simply says, 
"Customer Points by Month", and the specific month columns simply says, "Month 1", "Month 2" and
"Month 3". After hitting the "Go!" button, the table title specifies the range of the data within the
table, and the month columns specify the requested month range. The data in the table is a total of
the award points for each month for each customer and the total across all 3 months.

You can expand the number of rows visible on the table by increasing the "Rows per page" from its
default of 5, all the way up to 100. Also, each column of the table is sort-able, so you can quickly
determine the customers with the most reward points.

If you select a date range for which there is no data available, it will appear as "0". If no data at
all is available, the table will show no rows.

# Theory of Operation
## User Interface
This app uses the Material UI library from Google. In its current form, it's quite minimal
with limited decorations.

## App Operation
The App runs on NodeJS/JavaScript using the React library. It is recommended to run this on
NodeJS versions 14 and above.

The action generally begins in the src/App.js file. The state of the main application is held by the
`summaryData" element, with its update function `setSummaryData()`. When the state is updated, App.js
automatically re-renders and sends its state down to the src/ShowPoints component.

The updating of the state actually takes place in the src/Range component, where the user selects the
year and month. Some degree of string manipulation takes place because date ranges must be calculated
over 3 months, and the year can "roll over" during that time. The string manipulation is necessary in order
to remain consistent with a `YYYY-MM-DD` format to express the date.

The src/App component hands down the state updating function `handleRange()` to the src/Range component
so that the selected date range can be returned. The returned date range is used to instruct the API call
to select transaction data that's only within that range. In this way, the API is not handing back more
information than what is needed for the user interface.

The API - which is simulated - returns a promise that, when fulfilled, returns all transactions within the
requested date range. A utility function, `summarizeTransactions()` is then called in order to correlate all
the transactions across each of the months in the range, and consolidate on each customer. An iterator (`forEach`)
is used to process each transaction and update a temporary object structure for each customer. The actual
processing consists of a simple function (`calculatePoints()`) that takes each transaction and calculates
the award points.

After all the transactions have completed, the final summary is returned back to the main component (src/App)
and updates the `summaryData` using the `setSummaryData()` hook function. The updating of this state data
triggers a re-rendering of the main component, and since the prop for the ShowPoints component has now changed,
the ShowPoints component - containing the visible table - is updated.

The user can, at any time, select a different range and hit the "Go!" button and start the rendering
process all over again, thereby updating the table in real time.

## Developer notes
Pay attention to the "TODO" comments, as there are places where this program should be upgraded to protect
against possible errors. This program was developed assuming a "clean" execution environment; so it therefore
lacks any sort of schema and range checking. Also, the API is simulated; a real API is likely to fail on occasion,
so timeouts should be implemented along with sufficient exception-handling logic. In short, the user must be
notified if there is a problem on the back end so that he/she can go about fixing a broken connection, ensuring
the database is running, etc. Any exceptions should provide sufficient information to indicate the nature of
the problem.
