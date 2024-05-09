import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './Login/index'
import Callroll from './Callroll/callroll'
const App = () =>{
  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>点名</div>,
    },
    {
      path: '/login',
      element:<Login></Login>
    },
    {
      path: '/callroll',
      element:<Callroll />
    }
  ]);

  return <RouterProvider router={router}></RouterProvider>
}


export default App