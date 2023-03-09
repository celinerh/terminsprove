const isDev = process.env.NODE_ENV === "development";

export const apiUrl = isDev
  ? `http://localhost:4000`
  : `https://trainer-api.onrender.com`;
