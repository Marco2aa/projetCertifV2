import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Header from "./Components/Header.js"
import Homepage from "./Pages/Homepage.js";
import CoinPage from "./Pages/CoinPage.js";
import { styled } from '@mui/styles';
import Login from "./Pages/Login.js";
import Categorie from "./Pages/Categorie.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Buy from "./Pages/Buy.js";
import Transaction from "./Pages/Transaction.js";
import Dashboard from "./Pages/Dashboard.js";


const AppContainer = styled('div')({
  backgroundColor: "#181A20",
  color: 'white',
  minHeight: '100vh',
  minWidth: '100%'
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <AppContainer>
          <Routes>
            <Route path='/categories' element={<Categorie />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/coins/:id' element={<CoinPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/buy' element={<Buy />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/transaction' element={<Transaction />} />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
