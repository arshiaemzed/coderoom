async function login(email: string, password: string) {
  const response = await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Login failed !");
  }

  return data;
}

export default login;
