fetch("https://api.openai.com")
  .then((r) => {
    console.log("STATUS:", r.status);
  })
  .catch((err) => {
    console.error("ERROR:", err);
  });