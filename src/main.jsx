import { createRoot } from 'react-dom/client'
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import AdminPage from './Pages/Admin';


const r = createBrowserRouter([
  {
    path:"",
    element: <Layout/>,
    children:[
      {
        index:true,
        element: <Home />
      },
      {
        path: "admin/:id",
        element: <AdminPage />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={r} />
)
