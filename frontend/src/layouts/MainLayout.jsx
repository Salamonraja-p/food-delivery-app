import Navbar from "./Navbar";
import Footer from "./Footer";
 
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
    
      <Navbar />
 
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <Footer />

    </div>
  );
};
 
export default MainLayout;