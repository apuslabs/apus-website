import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Dashboard';
import Works from '../pages/Works'
import AiAgents from '../pages/AiAgents'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/dashboard',
    id: 'dashboard',
    element: <Home />
  },
  {
    path: '/works',
    id: 'works',
    element: <Works />
  },
  {
    path: '/aiAgents',
    id: 'aiAgents',
    element: <AiAgents />
  }
])

export default routes