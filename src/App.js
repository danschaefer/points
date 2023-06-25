import './App.css';
import {Container} from "@mui/material";
import Range from "./Range";

export default function App() {

    function handleRange(year,month) {
        console.log(`YEAR: ${year}  Month: ${month}`);
        // TODO
    }

  return (
    <Container className="App" maxWidth="lg">
        <h1 className="AppTitle">
            Get Your Points Here
        </h1>
        <Range handleRange={handleRange} />
    </Container>
  );
}

