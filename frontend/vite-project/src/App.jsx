import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./components/Home";
import DepthInput from "./components/DepthInput";
import Finale from "./components/Finale";
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import UploadAnimal from './components/UploadAnimal';
import ProtectedRoute from './components/ProtectedRoute';
import NutritionChart from './components/NutritionChart';
import Contact from './components/Contact';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5DC' }}>
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="upload-animal" element={<UploadAnimal />} />
                <Route path="depth-input" element={<DepthInput />} />
                <Route path="finale" element={<Finale />} />
                <Route path="home" element={<Home />} />
                <Route path="nutrition-chart" element={<NutritionChart />} />
                <Route path="contact" element={<Contact />} />
                </Route>
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;