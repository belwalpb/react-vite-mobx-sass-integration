import React from 'react'
import MyRoutes from '@/router'
import { useVcosole } from './hooks/useVconsole'
// This is the global page and can do some other operations

export default function App() {
  useVcosole()
  return (
    <div>
      <MyRoutes />
    </div>
  )
}
