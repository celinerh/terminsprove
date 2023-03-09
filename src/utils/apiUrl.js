const local = `http://localhost:4000`;
export const apiUrl =
  process.env.NODE_ENV === "development"
    ? local
    : "https://trainer-api.onrender.com";
