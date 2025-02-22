import { useEffect, useState } from "react";
import { apiUrl } from "../utils/apiUrl";

const useClasses = () => {
  const [classes, setClasses] = useState();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/classes`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Could not fetch the data for that resource");
        }
        return response.json();
      })
      .then((data) => {
        setClasses(data);
        setIsPending(false);
        setError(null);
      })
      .catch((error) => {
        setIsPending(false);
        setError(error.message);
      });
  }, []);

  return { classes, error, isPending };
};

export default useClasses;
