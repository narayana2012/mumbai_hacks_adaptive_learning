import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

import MarkdownPreview from "@uiw/react-markdown-preview";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const url = "http://localhost:8080";

const validation_prompt1 = `
You are an evaluator AI.
Your task is to take a question, compare its answer and user_input and determine the feedback to provide for the question.
 
The list of questions is given here:
{input}
 
Format the output as given below:
 
{
    "questions": [
        {
            "question": "text of question 1",
            "user_input": "answer of question 1",
            "status": "1 if answer is correct and 0 if it is incorrect",
            "feedback": "feedback for answer 1"
},
        {
            "question": "text of question 2",
            "answer": "answer of question 2",
            "status": "1 if answer is correct and 0 if it is incorrect",
            "feedback": "feedback for answer 2"
},
        {
            "question": "text of question 3",
            "answer": "answer of question 3",
            "status": "1 if answer is correct and 0 if it is incorrect",
            "feedback": "feedback for answer 3"
}
    ]
}
 
Don't give anything in the output besides the JSON. Strictly adhere to the format given above.`;

const validation_prompt = `
You are an evaluator AI.
Your task is to take a question, compare its answer and user_input and determine the feedback to provide for the question.
 
The list of questions is given here:
{input}
 
Format the output as given below:
 
{
    "questions": [
        {
            "question": "text of question 1",
            "user_input": "answer of question 1",
            "status": "1 if answer is correct and 0 if it is incorrect",
            "feedback": "feedback for answer 1"
},
        {
            "question": "text of question 2",
            "answer": "answer of question 2",
            "status": "1 if answer is correct and 0 if it is incorrect",
            "feedback": "feedback for answer 2"
},
        {
            "question": "text of question 3",
            "answer": "answer of question 3",
            "status": "1 if answer is correct and 0 if it is incorrect",
            "feedback": "feedback for answer 3"
}
    ]
}
 
Don't give anything in the output besides the JSON. Strictly adhere to the format given above.`;

const AssessmentDialog = ({
  open,
  onClose,
  questions,
  onSubmit,
  fetchTopicContent,
  summary,
  topic,
}) => {
  const navigate = useNavigate();
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showStudyMore, setShowStudyMore] = useState(false);

  const handleNavigate = () => {
    navigate(`/ai-tutor/python/${topic}`, { state: { summary } });
  };

  const handleAnswerChange = (index, value) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const result = questions.map((q, index) => ({
      question: q.question,
      answer: q.answer,
      user_input: userAnswers[index] || "",
    }));

    try {
      const response = await axios.post(`${url}/llm-response`, {
        prompt: validation_prompt,
        input: JSON.stringify(result),
        history: [],
      });
      const apiResponse = JSON.parse(response.data.response).questions;
      setFeedback(apiResponse); // Store the feedback
      onSubmit(apiResponse); // Send API response back to Detail component

      // Check for incorrect answers and update "Study More" button visibility
      const incorrectCount = apiResponse.filter(
        (item) => item.status === "0"
      ).length;
      setShowStudyMore(incorrectCount > 1);
      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      onSubmit({ error: "Failed to submit assessment" });
      setSubmitting(false);
    }

    setSubmitting(false);
  };

  const handleDialogClose = () => {
    setUserAnswers({});
    setFeedback(null);
    setShowStudyMore(false); // Reset the Study More button visibility
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="lg" fullWidth>
      {summary ? (
        <>
          <MarkdownPreview
            source={summary}
            style={{ padding: "20px" }}
          ></MarkdownPreview>
          <Typography variant="body1" style={{ padding: "20px" }}>
            You need assistant learning , Please click below to talk to one on
            one teaching assistant
          </Typography>
          <Button
            onClick={handleNavigate}
            sx={{
              background: "#000",
              width: "120px",
              margin: "0 auto",
              marginBottom: "20px",
              color: "#fff",
            }}
          >
            Ai Assistant
          </Button>
        </>
      ) : (
        <>
          <DialogTitle>Assessment</DialogTitle>
          <DialogContent>
            {questions.map((q, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <Typography variant="body1">{`Question ${index + 1}. ${
                  q.question
                }`}</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  label="Your Answer"
                  variant="outlined"
                  value={userAnswers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  disabled={!!feedback} // Disable input if feedback is received
                />
                {feedback && (
                  <Typography
                    variant="body2"
                    style={{
                      color: feedback[index].status === "1" ? "green" : "red",
                      marginTop: "5px",
                    }}
                  >
                    {feedback[index].status === "1" ? "" : "Wrong Answer"}
                  </Typography>
                )}
              </div>
            ))}
          </DialogContent>
          <DialogActions style={{ justifyContent: "space-between" }}>
            {/* <div>
              {showStudyMore && (
                <Button
                  color="primary"
                  onClick={() => {
                    fetchTopicContent();
                    handleDialogClose();
                  }}
                >
                  Study More
                </Button>
              )}
            </div> */}
            <div>
              <Button
                onClick={handleDialogClose}
                color="secondary"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                disabled={submitting || !!feedback}
                style={{
                  backgroundColor: "#0B1627", // Dark blue color
                  color: "#FFFFFF", // White text color
                  borderRadius: "10px", // Rounded corners
                  padding: "10px 20px", // Padding for size
                  textTransform: "none", // Keep original text casing
                }}
              >
                {submitting ? "Validating..." : "Validate"}
              </Button>
            </div>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AssessmentDialog;
