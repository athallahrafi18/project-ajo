import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import CustomerRoutes from "./routes/customerRoutes";
import DashboardRoutes from "./routes/dashboardRoutes";
import Loading from "./components/Loading";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* 🔹 Customer routes tetap diakses tanpa login */}
            <Route path="/*" element={<CustomerRoutes />} />

            {/* 🔹 Proteksi dashboard dengan middleware autentikasi */}
            <Route path="/dashboard/*" element={<DashboardRoutes />} />
          </Routes>
          <Toaster position="top-right" reverseOrder={false} />
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;