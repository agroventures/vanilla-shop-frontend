const NotFound = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl mt-4 text-gray-600">
          Page not found
        </p>
        <a
          href="/"
          className="mt-6 text-blue-600 hover:underline"
        >
          Go back home
        </a>
      </div>
    );
  };
  
  export default NotFound;
  