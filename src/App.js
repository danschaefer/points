// App.js

import './App.css';
import { Container } from "@mui/material";
import Range from "./Range";
import ShowPoints from "./ShowPoints";
import { getTransactions } from "./api";
import { useState } from "react";
import { summarizeTransactions } from "./utils";

export default function App() {
    // The summaryData state is used to convey transaction data from the API to the display table.
    // It gets updated within the handleRange() handler
    // The information contained within will change, including the title and the headers
    const [summaryData, setSummaryData] = useState({
        title: "Customer Points by Month",
        headers: ["Customer ID","Customer Name","Month 1","Month 2","Month 3","Total"],
        data: []
    });

    /**
     * This handler gets all transactions for the range and creates data for the table
     * It first uses the API to get all the transactions for the indicated range and
     * then builds a summary that shows each customer's point calculations for each
     * month within the indicated 3 month range.
     * Once the data is obtained and formatted correctly, update the "summaryData" state.
     * @param year
     * @param month
     */
    function handleRange(year,month) {
        // Get all the customer transactions for the date range within an asynchronous call.
        // The start and end dates are calculated below depending on the given year and month.
        const start = `${year}-${month}-01`; // The start date
        // The below statement may seem obtuse: Keep in mind that we need to calculate the end date
        // to be 3 months from the start date, but the result must be a string of YYYY-MM-DD.
        // Having the final date as "31" is acceptable because it will still register as being
        // in the range of that month, even if the month has less than 31 days. Note to self:
        // don't try to use this date format for anything else; it will not work.
        const end = parseInt(month) > 10 ? // roll the year if later than October
            `${(parseInt(year)+1).toString()}-0${(parseInt(month)-10).toString()}-31` :
            `${year}-${("0"+(parseInt(month)+2).toString()).slice(-2)}-31`; // ensure a leading "0" on months 1 - 9
        // Call the API to get all the transactions within the 3-month range of the start date
        // Asynchronous call, so the component fills out when the promise is fulfilled
        getTransactions(start,end)
            .then(transactions => {
                // At this point, all the transactions are available; however, they need to be
                // processed further to separate out each customer and the associated points
                // for each month.
                // The dirty work will be done in a utility function and placed directly into the state
                setSummaryData(summarizeTransactions(transactions,start,end));
            })
    }


    return (
    <Container className="App" maxWidth="lg">
        <h1 className="AppTitle">
            Customer Points by Month
        </h1>
        <Range handleRange={handleRange} />
        <ShowPoints tally={summaryData} />
    </Container>
  );
}

