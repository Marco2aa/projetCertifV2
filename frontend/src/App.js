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

const AppContainer = styled('div')({
  backgroundColor: "rgb(28, 28, 28)",
  color: 'white',
  minHeight: '100vh',
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
          <Header />
          <Routes>
            <Route path='/categories' element={<Categorie />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/coins/:id' element={<CoinPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/buy' element={<Buy />} />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
