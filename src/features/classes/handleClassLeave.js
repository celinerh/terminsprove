import { apiUrl } from "../../utils/apiUrl";

const handleClassLeave = (userId, userToken, classId) => {
  fetch(`${apiUrl}/api/v1/users/${userId}/classes/${classId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw Error("Could not fetch the data for that resource");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export default handleClassLeave;
