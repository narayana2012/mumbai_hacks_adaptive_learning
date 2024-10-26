import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useLocation } from "react-router-dom";

const url = "http://localhost:8080";

const AiTutor = () => {
  const location = useLocation();
  const { summary } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const { topic, course } = useParams();
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const initialize = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/chat_initialize`, {
        course,
        topic,
      });
      const updatedTopic = response.data.response;
    } catch (error) {
      console.error("Error fetching topic content:", error);
    }
  };

  const chat = async () => {
    setLoading(true);
    try {
      // setMessages((prev) => [...prev, userMessage]);
      setInputText(""); // Clear the input
      const userMessage = { role: "user", content: inputText };
      setMessages((prev) => [...prev, userMessage]);
      const response = await axios.post(`${url}/chat`, {
        user_input: inputText,
      });
      const botMessage = { role: "assistant", content: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topic content:", error);
    }
    setLoading(false);
  };

  const initializeChat = async (summary) => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}/chat`, { user_input: summary });
      const updatedTopic = response.data.response;
      setMessages([{ role: "assistant", content: updatedTopic }]);
    } catch (error) {
      console.error("Error fetching topic content:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    initialize();
    console.log(summary);
    initializeChat(summary);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="94vh"
      margin="0 auto"
      border="1px solid #ddd"
    >
      {/* Chat Window */}
      <Box
        ref={chatContainerRef}
        flexGrow={1}
        padding={2}
        overflow="auto"
        bgcolor="#f9f9f9"
        component={Paper}
        elevation={0}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
            mb={2}
          >
            <Box
              bgcolor={msg.role === "user" ? "#e0e0e0" : "#e0e0e0"}
              color={msg.role === "user" ? "white" : "black"}
              padding={1.5}
              borderRadius={1}
              maxWidth="70%"
            >
              <Typography variant="body1">
                {" "}
                <MarkdownPreview
                  source={msg.content}
                  style={{ padding: "20px" }}
                ></MarkdownPreview>
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Input Area */}
      <Box display="flex" padding={2} borderTop="1px solid #ddd">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && chat()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={chat}
          style={{ marginLeft: 8 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default AiTutor;
