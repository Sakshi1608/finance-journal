import './App.css';
import { Link } from 'react-router-dom';
import Header from './Header';
function Home() {
    return (
        <div>
           <Header/>
      
    <div className="container" style={{ fontSize: 'calc(10px + 2vmin)' }}>
      
      <h1>Finance Journal</h1>
      <h3>A journal for your financial health!</h3>
      <div>
     <Link to="/login">Login</Link>
      <br/>
        New here?  <Link to="/signup">Sign Up Here!</Link>
     </div> 
    </div>
      </div>
    );
}
export default Home;