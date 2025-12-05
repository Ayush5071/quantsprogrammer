import { useEffect, useState } from "react";
import axios from "axios";

export default function useCurrentUser(): any {
  const [user, setUser] = useState<any>(undefined); // undefined = loading, null/false = not logged in
  
  useEffect(() => {
    let isMounted = true;
    
    axios.get("/api/users/me")
      .then(res => {
        if (isMounted && res.data.user) {
          setUser(res.data.user);
        } else if (isMounted) {
          setUser(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUser(null);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return user; // undefined = loading, null = not logged in, object = logged in
}
