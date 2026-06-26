import './App.css'
import AppLayout from './components/AppLayout'
import { BrowserRouter, Route, Routes } from 'react-router'
import Delicate from './pages/Delicate'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import Download from './pages/Download/Download'

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppLayout>
          <Routes>
            <Route path='/' element={<Delicate />} />
            <Route path='/download' element={<Download />} />
          </Routes>
        </AppLayout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
