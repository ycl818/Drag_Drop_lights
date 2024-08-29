import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import { Hourglass } from "react-loader-spinner";
import { askChatGPT } from "../api/chatGPT";

const actionMap = {
  add: "please elaborate this sentence: first you need to click the top right ADD button and drag the desire machine icon and drop it into the white board and then you can set the name of that machine",
};

const AIAssistantDrawer = ({
  open,
  onClose,
  onAddNode,
  onDeleteNode,
  nodes,
}) => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNodeTypeSelection, setShowNodeTypeSelection] = useState(false);
  const [isAddNodePrompt, setIsAddNodePrompt] = useState(false);
  const [isDeleteNodePrompt, setIsDeleteNodePrompt] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState("");

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleAIPromptSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      const lowerCasePrompt = aiPrompt.toLowerCase();
      const isAddRelated = lowerCasePrompt.includes("add");
      const isDeleteRelated =
        lowerCasePrompt.includes("delete") ||
        lowerCasePrompt.includes("remove");

      if (isAddRelated) {
        response = await askChatGPT(actionMap["add"]);
        setCurrentResponse(response.content);
        setIsAddNodePrompt(true);
      } else if (isDeleteRelated) {
        response = { content: "Please provide the ID you want to remove." };
        setCurrentResponse(response.content);
        setShowDeleteInput(true);
      } else {
        response = await askChatGPT(aiPrompt);
        setCurrentResponse(response.content);
        setIsAddNodePrompt(false);
      }

      const newChat = {
        id: Date.now(),
        question: aiPrompt,
        answer: response.content,
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prevHistory) => [newChat, ...prevHistory]);

      setAiPrompt("");
      setShowHistory(false);
    } catch (error) {
      console.error("Error in AI response:", error);
      setCurrentResponse(
        "Sorry, an error occurred while processing your request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInputSubmit = (e) => {
    e.preventDefault();
    const nodeId = deleteInputValue;
    if (!Array.isArray(nodes)) {
      setCurrentResponse(
        "Error: Unable to access nodes. Please try again later."
      );
      setShowDeleteInput(false);
      setDeleteInputValue("");
      return;
    }
    if (nodeId && nodes.some((node) => node.id === nodeId)) {
      setCurrentResponse(`Are you sure you want to delete node ${nodeId}?`);
      setIsDeleteNodePrompt(true);
      setNodeToDelete(nodeId);
    } else {
      setCurrentResponse(`No node with ID ${nodeId} found on the board.`);
    }
    setShowDeleteInput(false);
    setDeleteInputValue("");
  };

  const handleConfirmAddNode = (confirmed) => {
    if (confirmed) {
      setShowNodeTypeSelection(true);
    } else {
      setIsAddNodePrompt(false);
      setCurrentResponse(
        "Okay, I won't add a node. Is there anything else I can help you with?"
      );
    }
  };

  const handleNodeTypeSelection = (type) => {
    onAddNode(type);
    setShowNodeTypeSelection(false);
    setIsAddNodePrompt(false);
    setCurrentResponse(
      `A new node of type ${type} has been added to the board.`
    );
  };

  const handleConfirmDeleteNode = (confirmed) => {
    if (confirmed) {
      onDeleteNode(nodeToDelete);
      setCurrentResponse(`Node ${nodeToDelete} has been deleted.`);
    } else {
      setCurrentResponse("Okay, I won't delete the node.");
    }
    setIsDeleteNodePrompt(false);
    setNodeToDelete(null);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const formatResponse = (text) => {
    if (!text) return null;
    const paragraphs = text.split("\n\n");
    return paragraphs.map((paragraph, index) => (
      <Typography key={index} paragraph>
        {paragraph}
      </Typography>
    ));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  const handleDeleteHistory = (event, id) => {
    event.stopPropagation();
    setChatHistory((prevHistory) =>
      prevHistory.filter((chat) => chat.id !== id)
    );
  };

  const truncateTitle = (title, maxLength = 28) => {
    if (title.length <= maxLength) return title;
    return title.substr(0, maxLength - 3) + "...";
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        role="presentation"
      >
        <Typography variant="h6" gutterBottom>
          AI Assistant
        </Typography>
        <Divider />
        <Box sx={{ mb: 2, mt: 2 }}>
          <Button
            startIcon={<HistoryIcon />}
            onClick={toggleHistory}
            variant="outlined"
            fullWidth
          >
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "auto", mb: 2 }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={["#306cce", "#72a1ed"]}
              />
              <Typography sx={{ mt: 2 }}>
                AI is generating the answer...
              </Typography>
            </Box>
          ) : showHistory ? (
            chatHistory.map((chat) => (
              <Accordion key={chat.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  <Tooltip title="Delete" arrow>
                    <IconButton
                      size="small"
                      onClick={(event) => handleDeleteHistory(event, chat.id)}
                      sx={{ mr: 1, p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Typography
                    sx={{
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {truncateTitle(chat.question)}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {formatTimestamp(chat.timestamp)}
                  </Typography>
                  <Typography variant="body2" color="primary" gutterBottom>
                    Question: {chat.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Answer:
                  </Typography>
                  {formatResponse(chat.answer)}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            currentResponse && (
              <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "4px" }}>
                {formatResponse(currentResponse)}
                {isAddNodePrompt && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      Help you add a node?
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Button
                        onClick={() => handleConfirmAddNode(false)}
                        variant="outlined"
                      >
                        NO
                      </Button>
                      <Button
                        onClick={() => handleConfirmAddNode(true)}
                        variant="contained"
                      >
                        YES
                      </Button>
                    </Box>
                  </Box>
                )}
                {showNodeTypeSelection && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Select node type:</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Button
                        onClick={() => handleNodeTypeSelection("m1")}
                        variant="contained"
                      >
                        M1
                      </Button>
                      <Button
                        onClick={() => handleNodeTypeSelection("m2")}
                        variant="contained"
                      >
                        M2
                      </Button>
                      <Button
                        onClick={() => handleNodeTypeSelection("m3")}
                        variant="contained"
                      >
                        M3
                      </Button>
                    </Box>
                  </Box>
                )}
                {showDeleteInput && (
                  <Box
                    component="form"
                    onSubmit={handleDeleteInputSubmit}
                    sx={{ mt: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Enter node ID to delete"
                      variant="outlined"
                      value={deleteInputValue}
                      onChange={(e) => setDeleteInputValue(e.target.value)}
                      margin="normal"
                    />
                    <Button type="submit" variant="contained" fullWidth>
                      Confirm
                    </Button>
                  </Box>
                )}
                {isDeleteNodePrompt && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      Confirm delete node?
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Button
                        onClick={() => handleConfirmDeleteNode(false)}
                        variant="outlined"
                      >
                        NO
                      </Button>
                      <Button
                        onClick={() => handleConfirmDeleteNode(true)}
                        variant="contained"
                      >
                        YES
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )
          )}
        </Box>

        <form onSubmit={handleAIPromptSubmit}>
          <TextField
            fullWidth
            label="Ask AI Assistant"
            variant="outlined"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default AIAssistantDrawer;
