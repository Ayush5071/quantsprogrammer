import { useEffect, useState } from "react";
import axios from "axios";

export default function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    axios.get("/api/users/me").then(res => setUser(res.data.user)).catch(() => setUser(null));
  }, []);
  return user;
}
