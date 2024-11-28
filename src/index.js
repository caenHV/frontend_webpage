import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import MainPage from './mainpage/index';
import LogPage from './logpage/index';
import StatusCalcPage from './statuscalc';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/log",
    element: <LogPage />,
  },
  {
    path: "/statuscalc",
    element: <StatusCalcPage />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
      <RouterProvider router={router} />
  // </React.StrictMode>
);
