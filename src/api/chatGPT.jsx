import axios from "axios";

export const askChatGPT = async (question) => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_API_URL,
      { question },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    return {
      role: "error",
      content: "Sorry, an error occurred while processing your request.",
    };
  }
};
