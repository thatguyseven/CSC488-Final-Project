import { Link, useNavigate } from "react-router-dom";
// import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/Login");
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      <h2 className="h2">
        Welcome to 
      </h2>


      <div className="paraOne">
        This is designed to...
        <br></br>
        <strong>Please navigate to the following pages: </strong>
        <br></br>
        Create Record: Use this page to create a (...) record.
        <br></br>
        Delete a Record: Use this page to delete a (...) record.
        <br></br>
        Update a Record: Use this page to update a (...) record. 
        <br></br>
        All records: To display all records.
        
      </div>
    </div>
  );
};

export default Home;