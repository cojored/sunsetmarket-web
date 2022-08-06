import Error from "next/error";
import { useState, useEffect } from "react";

function EPage() {
  const [error, setError] = useState("");
  useEffect(() => {
    setError(new URL(window.location).searchParams.get("e"));
  });
  return (
    <>
      <Error statusCode="ERROR" title={error}></Error>
    </>
  );
}

export default EPage;
