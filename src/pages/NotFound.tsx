import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => { 
  const location = useLocation();

  useEffect(() => {
    console.warn("404 Not Found: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-4xl md:text-6xl font-bold text-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you're looking for at <code className="font-mono bg-muted p-1 rounded">{location.pathname}</code> could not be found.
      </p>
      <Button asChild className="mt-8" variant="hero">
        <Link to="/">Return to Home</Link>
      </Button>
    </div> 
  );
};

export default NotFound;
