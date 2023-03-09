import { useEffect, useState } from "react";
import { apiUrl } from "../utils/urls";

const useAsset = (assetId) => {
  const [asset, setAsset] = useState();
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/assets/${assetId}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Could not fetch the data for that resource");
        }
        return response.json();
      })
      .then((data) => {
        setAsset(data);
        setIsPending(false);
        setError(null);
      })
      .catch((error) => {
        setIsPending(false);
        setError(error.message);
      });
  }, [assetId]);

  return { asset, error, isPending };
};

export default useAsset;
