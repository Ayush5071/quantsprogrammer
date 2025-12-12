import puter from "https://cdn.puter.com/sdk/v2/puter.mjs";

(async () => {
  try {
    console.log("Calling Puter AI...");

    const response = await puter.ai.chat({
      model: "claude-3.7-sonnet", 
      messages: [
        { role: "user", content: "Hello Puter, say hi!" }
      ]
    });

    console.log("AI Response:", response.output_text);
  } catch (err) {
    console.error("ERROR:", err);
  }
})();
