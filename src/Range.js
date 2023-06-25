import './App.css';
import Button from '@mui/material/Button';
import {useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

/**
 * Obtain the range of dates to be used for searching data
 * Two drop-downs will be used - one to collect the month, the other to
 * handle the year. The month and year will determine the beginning range
 * of dates used to search the database.
 * When month and year are determined, the "Go" button will be enabled,
 * sending the YYYY-MM back to the parent
 *
 * @param handleRange - Parent function used to return the year and month
 * @returns {JSX.Element}
 * @constructor
 */
export default function Range({handleRange}) {
    // Internal states to keep track of the year and month
    const [month, setMonth] = useState(''); // start with an empty string
    const [year, setYear] = useState(''); // start with an empty string
    let goEnable = false; // remains false until both month and year are real values

    // The month handler simply updates the state
    function handleMonth(event) {
        setMonth(event.target.value);
    }

    // The year handler simply updates the state
    function handleYear(event) {
        setYear(event.target.value);
    }

    // Handle the GO button click
    function handleGo(event) {
        handleRange(year,month);
    }

    goEnable = month !== '' && year !== ''; // enable the "GO" button if month and year are set

    // The values returned by the Selects can be concatenated to form YYYY-MM
    // The "GO" button is disabled until the month and year are set to real values
    // TODO - Base the year on the current year and go back 5 years. Currently it's hard-coded to 2023
    return (
        <>
            <div>
            <FormControl style={{minWidth: 120, padding:10 }} variant="standard">
                <InputLabel id="select-month">Month</InputLabel>
                <Select
                    labelId="select-month"
                    id="select-month-id"
                    value={month}
                    label="Month"
                    onChange={handleMonth}
                >
                    <MenuItem value="01">January</MenuItem>
                    <MenuItem value="02">February</MenuItem>
                    <MenuItem value="03">March</MenuItem>
                    <MenuItem value="04">April</MenuItem>
                    <MenuItem value="05">May</MenuItem>
                    <MenuItem value="06">June</MenuItem>
                    <MenuItem value="07">July</MenuItem>
                    <MenuItem value="08">August</MenuItem>
                    <MenuItem value="09">September</MenuItem>
                    <MenuItem value="10">October</MenuItem>
                    <MenuItem value="11">November</MenuItem>
                    <MenuItem value="12">December</MenuItem>
                </Select>
            </FormControl>
            <FormControl style={{minWidth: 120, padding:10}} variant="standard">
                <InputLabel id="select-year">Year</InputLabel>
                <Select
                    labelId="select-year"
                    id="select-year-id"
                    value={year}
                    label="Year"
                    onChange={handleYear}
                >
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2019">2019</MenuItem>
                </Select>
            </FormControl>
            </div>
            <FormControl>
                <Button
                    variant="contained"
                    disabled={!goEnable}
                    onClick={handleGo}
                >GO!</Button>
            </FormControl>
        </>
    );
}
