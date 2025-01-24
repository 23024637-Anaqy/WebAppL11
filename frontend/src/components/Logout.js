const Logout = () => {
    const handleLogout = () => {
      localStorage.removeItem('jwt');
      window.location.href = '/login';
    };
  
    return <button onClick={handleLogout}>Logout</button>;
  };
  
  export default Logout;