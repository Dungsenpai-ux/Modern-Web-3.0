import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import IPFSDemo from "./components/IPFSDemo";
const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <Transactions />
    <Footer />
    <IPFSDemo/>
  </div>
);

export default App;
