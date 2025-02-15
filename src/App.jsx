
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Crud from './Component/Crud/Crud.jsx';
import Login from './Component/Login/Login.jsx';
import Layout from './Component/Layout/Layout.jsx';
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute.jsx';
import Otp from './Component/Otp/Otp.jsx';
import Signup from './Component/Signup/Signup.jsx';


function App() {
  let routers = createBrowserRouter([
    {
      path: '', element: <Layout />, children: [
        { index: true, element: <ProtectedRoute><Crud /></ProtectedRoute> },
        { path: 'login', element: <Login /> },
        { path: 'Signup', element: <Signup /> },
        { path: "Otp/:email", element: <Otp /> }
      ]
    }
  ])
  return <RouterProvider router={routers}></RouterProvider>
}
export default App
