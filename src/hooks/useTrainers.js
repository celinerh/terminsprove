import { useEffect, useState } from "react";
import { apiUrl } from "../utils/urls";

const useTrainers = () => {
  const [trainers, setTrainers] = useState();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/trainers`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Could not fetch the data for that resource");
        }
        return response.json();
      })
      .then((data) => {
        setTrainers(data);
        setIsPending(false);
        setError(null);
      })
      .catch((error) => {
        setIsPending(false);
        setError(error.message);
      });
  }, []);

  return { trainers, error, isPending };
};

export default useTrainers;
