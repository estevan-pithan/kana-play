import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'

export function ProtectedLayout() {
  return (
    <div className="relative min-h-screen">
      <div className="bg-blob bg-blob--ochre h-[28rem] w-[28rem] -top-32 -left-32" />
      <div className="bg-blob bg-blob--amber h-96 w-96 right-0 top-1/3" />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  )
}
