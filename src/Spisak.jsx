import React, { useEffect } from "react";

export const Spisak = () => {
  const [data, setData] = React.useState({});
  useEffect(() => {}, []);
  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch("https://api.jsonbin.io/v3/b/668d00e6ad19ca34f88505b6", {
        headers: {
          "X-MASTER-KEY": "$2a$10$Pu6vPXlvxXKLNX5C0gfLge5IRH9WHFnj3gm0DuXnvpiFgDF.mKVk2",
          "X-ACCESS-KEY": "$2a$10$BQ6uU9SmifziXVrwVgHcceSD1K0kvghMnRkaG4ECg/fE7yIzGNLjq",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result);
      setData(result.record);
    } catch (error) {
      // setError(error.message);
    }
  }, []);

  React.useEffect(() => {
    void fetchData();
  }, [fetchData]);
  return (
    <div>
      <h1>Spisak </h1>
      {Object.keys(data).map((key) => {
        return (
          <div key={key}>
            <p>
              {key}:{data[key]}
            </p>
          </div>
        );
      })}
    </div>
  );
};
