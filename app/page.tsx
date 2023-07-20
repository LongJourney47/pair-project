"use client"; // This is a client component

// move chat array into the client side
// use usestate on top of it

import { useState, useEffect } from "react";
import axios from "axios";
import { NextPage } from "next";
import Head from "next/head";
import homePage from "@/app/homePage.module.css";
// import { chatArr } from "@/app/api/chatgpt/route";
// import './globals.module.css'

const Home: NextPage = (chatArr) => {

  const [textareaValue, setTextareaValue] = useState("");
  const [resultArray, setResultArray] = useState<string[]>([]);
  const [chatData, setChatData] = useState([]);
  
  const [messages, setMessages] = useState([
    { type: "system", content: "however i’m prompt tuning model" },
    { type: "user", content: "Whatever the user types in as their prompt?" },
  ]);

   // Function to save chat data to local storage
   const saveChatDataToLocalStorage = (chatData:any) => {
    localStorage.setItem("chatData", JSON.stringify(chatData));
  };

  // Function to load chat data from local storage on page load
  const loadChatDataFromLocalStorage = () => {
    const storedChatData = localStorage.getItem("chatData");
    if (storedChatData) {
      setChatData(JSON.parse(storedChatData));
    }
  };

  // Load chat data from local storage during the initial render
  useEffect(() => {
    loadChatDataFromLocalStorage();
  }, []);

  // Save chat data to local storage whenever chatData changes
  useEffect(() => {
    saveChatDataToLocalStorage(chatData);
  }, [chatData]);

  const handleTextareaChange = (e: any) => {
    setTextareaValue(e.target.value);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // setIsLoading(true);
    const form = e.currentTarget as HTMLFormElement;
    const userInput = form.message.value.trim();
    if (!userInput) return;

    axios
      .post(
        "/api/chatgpt",
        { product: userInput },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("response - line 116", response);

        // ----- add the code for later to test -----
        const userMessage = { type: "user", content: userInput };

        const assistantMessage = {
          type: "assistant",
          content: response.data.item, // Assuming the API response contains an 'item' property with the response content
        };
        // setMessages((prevMessages) => [...prevMessages, userMessage]);
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          assistantMessage,
        ]);

        let rawResult = response.data.item;
        // Append the new result to the array
        setResultArray((prevResults) => [...prevResults, rawResult]);
        console.log("chat history 2!! ", resultArray);
        form["message"].value = "";
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }

  console.log("chat history 2!! ", resultArray);
  return (
    <div>
      <main className={homePage.container}>
        <Head>
          {/* <title>ChatGPT Clone</title> */}
          <meta name="description" content="ChatGPT Clone with Next.js" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1 className={homePage.title}>ChatGPT Clone</h1>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${homePage.message} ${
                message.type === "user"
                  ? homePage["user-message"]
                  : homePage["assistant-message"]
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>

        {/* <form onSubmit={onSubmit} className="mt-4"> */}

        <form onSubmit={onSubmit} className={homePage.inputContainer}>
          <textarea
            name="message"
            className={homePage.textarea}
            onChange={handleTextareaChange}
          />
          <button
            type="submit"
            // className={homePage["send-button"]}
            className={`${homePage["send-button"]} ${
              !textareaValue ? homePage.hide : ""
            }`}
          >
            Send
          </button>
        </form>
      </main>

      <div className={homePage["chat-log"]}>
        {resultArray.map((result, index) => (
          <div key={index} className={homePage["chat-log-item"]}>
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
