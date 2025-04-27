import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import './App.css';

import Create from './Create/create.jsx';
import Delete from './Delete/deleteRecord.jsx';
import Update from './Update/update.jsx';
import Home from './Home/Home.jsx';
import Read from './Read/read.jsx';
import Layout from './Layout.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Home" element={<Home />} />
          <Route path="Create" element={<Create />} />
          <Route path="Delete" element={<Delete />} />
          <Route path="Update" element={<Update />} />
          <Route path="Read" element={<Read />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
