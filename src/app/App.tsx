import { BrowserRouter } from 'react-router-dom'
import { Providers } from './providers'
import { AppRoutes } from './routes'
import { Navbar } from '@/components/layout/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <Providers>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navbar />
          <AppRoutes />
        </div>
      </Providers>
    </BrowserRouter>
  )
}
