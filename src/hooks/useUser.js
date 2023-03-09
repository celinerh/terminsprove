import { useEffect, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import { apiUrl } from "../utils/urls";

const useUser = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const { token } = useToken();

  useEffect(() => {
    if (!token) return;

    fetch(`${apiUrl}/api/v1/users/${token.userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Could not fetch the data for that resource");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setIsPending(false);
        setError(null);
      })
      .catch((error) => {
        setIsPending(false);
        setError(error.message);
      });
  }, [token]);

  return { user, error, isPending };
};

export default useUser;
