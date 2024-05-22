import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './Login/index'
import Callroll from './Callroll/callroll'
import Courses from './selectcourse'
import Course from './course'
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
      path: '/courses',
      element:<Courses></Courses>
    },
    {
      path: '/callroll/:courseId',
      element:<Callroll />
    },
    {
      path: '/course/:id',
      element:<Course />
    }

  ]);

  return <RouterProvider router={router}></RouterProvider>
}


export default App