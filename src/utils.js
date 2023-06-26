// utils.js

// This file contains general utility functions

/**
 * Summarize a group of transactions across customers and monthly award points
 * The transactions appear as an array of JSON objects, where each object looks
 * something like this:
 * {
 *     customerId: 123,
 *     customerName: "John Doe",
 *     date: "2023-01-17",
 *     amount: 178.57
 * }
 *
 * The output will consist of a JSON object looking like this:
 * {
 *     title: "Customer Points by Month, July 2023 to September 2023",
 *     headers: ["Customer ID","Customer Name","July","August","September","Total"],
 *     data: [
 *         {
 *             id: "123",
 *             name: "John Doe",
 *             month1: 2237,
 *             month2: 5548,
 *             month3: 1187,
 *             total: 8972
 *         },{
 *             id: "118",
 *             name: "Jane Smith",
 *             month1: 14,
 *             month2: 35,
 *             month3: 44,
 *             total: 93
 *         } ...
 *     ]
 * }
 *
 * The algorithm works by iterating through each transaction and consolidating across
 * two dimensions: customer and month. Each transaction is analyzed to calculate the
 * number of award points based on the following rule:
 *   If the transaction is less than $50.00, no award points granted
 *   If the transaction is greater than or equal to $50.00, on point for each dollar above 50.
 *   If the transaction is greater than or equal to $100.00, an additional point for each dollar above 100.
 *   Portions of a dollar do not count, so a transaction of $50.99 will not amount to any award points.
 *
 * @param transactions <Array> - An array of transaction JSON objects
 * @param start <string> - Indicates the starting month in YYYY-MM-DD format
 * @param end <string> - Indicates the ending month in YYYY-MM-DD format
 *
 * BIG FAT TODO: Validate incoming information to ensure it conforms to the schema described above
 * ANOTHER TODO: If validation fails, throw an exception
 */
function summarizeTransactions(transactions,start,end) {
    // For convenience purposes, identify the three months in this range - it will be used for later comparisons
    const startMonth = start.split("-")[1];
    const middleMonth = startMonth === "12" ? "01" : ("0" + (parseInt(startMonth)+1).toString()).slice(-2);
    const endMonth = middleMonth === "12" ? "01" : ("0" + (parseInt(middleMonth)+1).toString()).slice(-2);

    // Calculate the title
    const beginRange = start
        .split('-') // break into an array of ["YYYY","MM","DD"]
        .slice(0,2) // remove the "DD" from the array
        .reverse() // change array to ["MM","YYYY"]
        .map((d,i) => {if(i === 0) return monthMap[d]; return d}) // map the month to a verbal name
        .join(" "); // Now it should say something like "July 2023"
    const endRange = end
        .split('-') // break into an array of ["YYYY","MM","DD"]
        .slice(0,2) // remove the "DD" from the array
        .reverse() // change array to ["MM","YYYY"]
        .map((d,i) => {if(i === 0) return monthMap[d]; return d}) // map the month to a verbal name
        .join(" "); // Now it should say something like "September 2023"
    const title = `Customer Points by Month, ${beginRange} to ${endRange}`; // complete the title

    // This will become the header row of the table
    const headers = ["Customer ID",
        "Customer Name",
        monthMap[startMonth], // convert the month MM to a real name
        monthMap[middleMonth],
        monthMap[endMonth],
        "Total"];

    // Now the hard part - Consolidate customer information
    // Iterate through the transactions and for each, create an object whose keys are the
    // customer ID, then add point information as calculated.
    let tally = {}; // Begin with an empty tally
    transactions.forEach(transaction => {
        let awardPoints = calculatePoints(transaction.amount); // calculate the award points

        // Test to see if this customer is already in the local data structure. If not, add it, and
        // then calculate the award points for the month
        if (!tally.hasOwnProperty(transaction.customerId)) {
            // This customer ID hasn't been encountered yet, so start a new object for it
            tally[transaction.customerId] = {
                name: transaction.customerName,
                month1: 0,
                month2: 0,
                month3: 0,
                total: 0
            }
        }
        // Now do the calculations for the tally object
        if (transaction.date.split('-')[1] === startMonth) {
            // add to the "month1" tally
            tally[transaction.customerId]["month1"] += awardPoints;
        }
        else if (transaction.date.split('-')[1] === middleMonth) {
            // add to the "month2" tally
            tally[transaction.customerId]["month2"] += awardPoints;
        }
        else {
            // add to the "month3" tally
            tally[transaction.customerId]["month3"] += awardPoints;
        }
        tally[transaction.customerId]["total"] += awardPoints; // update the total
    });

    // Now that customer information has been tallied, change the final format of the output
    // to meet the contract of this function call
    let retVal = {
        title, // condensed format
        headers
    };
    // fill out retVal.data with the tallied information
    retVal.data = Object.keys(tally).sort() // sort the keys for convenience - the display can re-sort as required
        .map(k => { // the "key" here is the customer ID, the rest can be picked up though the "rest" operator
            return {
                id: k,
                ...tally[k]
            }
        })
    return retVal;
}

const monthMap = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}

/**
 * Calculate the award points based on the amount of the transaction
 * @param amount <number> - The amount of the transaction
 */
function calculatePoints(amount) {
    let points = 0; // the default return amount

    const amt = Math.floor(amount); // do not give credit for portions of a dollar
    if (amt < 50) return points; // zero
    if (amt > 50) {
        points += amt - 50;
    }
    if (amt > 100) {
        points += amt - 100;
    }
    return points;
}

export { summarizeTransactions };
