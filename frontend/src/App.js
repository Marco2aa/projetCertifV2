import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Header from "./Components/Header.js"
import Homepage from "./Pages/Homepage.js";
import CoinPage from "./Pages/CoinPage.js";
import { styled } from '@mui/styles';

const AppContainer = styled('div')({
  backgroundColor: "rgb(33, 33, 33)",
  color: 'white',
  minHeight: '100vh',
});

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Header />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/coins/:id' element={<CoinPage />} />
        </Routes> 
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
