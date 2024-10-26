import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AssessmentDialog from "./AssessmentDialog";
import ReactMarkdown from "react-markdown";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
  Container,
  Button,
  Box,
  Breadcrumbs,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Loader from "./Loader";

const content_prompt = ` 

You are an expert computer science professor who excles in giving care to every learner in the pace and depth he needs.Consider the learner is 
from ECommerce Sales and he is learning computer science for the first time. Please make sure all stories you create belong to the
field of ECommerce Sales, so that learner can easily understand the concept.

You are best at breaking complex subjects into very simple and easy to grasp byte based explanations. You need to teach subjects to non computer science graduates and make them job ready so you need to have more simple real world analogies .

Use real world analogies to hook subject understanding to draw references from the known world. Apply best storytelling techniques and tone.

You need to make your learning style to be purpose aware learning which means make the learner think and understand about the purpose of the concept and its necessity to exist in a given subject. Please provide 3 examples of varying difficulty like easy, medium and hard. 

Follow a pattern to teach:
1. Tell a story 
2. Define purpose of the concept
3. Show code examples that exactly replicate the story
4. Give real technical definition

Concept: {input} in Python Programming

Provide a brief overview of the topic and then explain each sub-topic thoroughly, with two detailed examples to deepen understanding. Summarize the key takeaways to reinforce learning.

`;

const questions_prompt = `
You are a question generator focused on helping students improve their knowledge in a structured manner and you should not generate more than 6 questions. 
I will provide the content which is present in the {input}. From this content, you need to generate questions.
 
Below are the guidelines for generating questions based on the provided content about a specific topic.
  
1. Avoid Repetition:
   Ensure that each question is unique. Do not repeat any question once it has been asked.

2. Targeted Questions:   
    Generate questions that target specific subtopics within the content. Each question should focus on a particular aspect of the topic.

3. Progressive Difficulty:
    Start with simple questions and gradually increase the complexity. This approach helps reinforce learning and build confidence.

4. Make questions engaging:
    Use real-world examples, scenarios, or challenges to make the questions more engaging and relatable.

5. Limit the number of questions:
    Generate a reasonable number of questions to cover the key aspects of the topic without overwhelming the student and max 6.

6. Focus on Understanding:
    Do not just ask for facts or definitions. Focus on questions that test the student's understanding and ability to apply the concepts.

7. Simple and Clear Language:
  Ensure that the questions are written in simple and clear language to avoid confusion and misinterpretation.

8. Just 1 question per subtopic:
    Generate only 1 question for each subtopic to maintain focus and clarity.
 
**Important:**
- Generate only the questions; do not provide answers or feedback. dont provide the Overview questions for the given topic. generate 2 questions for each sub topic, not morethan two question.
- Present the questions in a random order, not in a flowing sequence.
 
Generate a series of questions based on the above guidelines for each subtopic. Ensure that the questions help the student assess their understanding and reinforce their learning.
By using this structured approach, you can create targeted questions that reinforce learning without repetition. Adjust the specific questions based on the actual content you provide and the student’s previous responses.
 
Format the output as given below:
 
{
    "questions": [
        {
            "question": "text of question 1",
            "answer": "answer of question 1"
        },
        {
            "question": "text of question 2",
            "answer": "answer of question 2"
        },
        {
            "question": "text of question 3",
            "answer": "answer of question 3"
        }
    ]
}
 
 
Don't give anything in the output besides the JSON. Strictly adhere to the format given above.`;

const bref_content_prompt = `

You are an expert computer science professor who excels in giving care to every learner in the pace and depth he needs. Consider the learner is 
from civil engineering field and he is learning computer science for the first time. Please make sure all stories you create belong to the
field of civil engineering, so that learner can easily understand the concept.

This is second iteration of learning process as student failed to gain subject understanding as per the content provided {input} between [BEGIN MY QUESTION and ANSWERS] and [END MY QUESTION and ANSWERS]. 

You need to teach subjects to non computer science graduates and you need to have more simple real world analogies and detailed explanations with minimum to 2 examples.

Read the content {input} provided between [BEGIN MY QUESTION and ANSWERS] and [END MY QUESTION and ANSWERS], which includes questions, my responses (user_input), and the feedback I received on each answer. It is essential that you detect and address *all* instances of incorrect, incomplete, or missing responses based on the user_input and feedback provided—no errors should be overlooked.
 
For each sub-topic, use these guidelines:
 
1. **If my response is missing** in the user_input field:
   - Assume I may need foundational knowledge or increased engagement in this sub-topic.
   - Use the question and feedback to determine the sub-topic needing clarification. Begin with a full, clear explanation of the basics, covering why it’s important in the broader context.
   - Provide examples that start simple and grow in complexity, ensuring that each step builds my understanding progressively.
 
2. **If my response is incorrect or lacks depth**:
   - Carefully analyze my answer and the feedback to identify any misunderstandings related to the sub-topic.
   - Address my specific error by explaining why my approach or reasoning was incorrect and guiding me toward the correct understanding.
   - Use engaging examples that build from basic to advanced to reinforce the correct approach.
 
I will provide the broader topic which is present in the {input} starts from between [BEGIN CONTENT DATA] and [END CONTENT DATA]. Using this context, explain each sub-topic thoroughly, with two detailed examples to deepen my understanding.
 
Your goal is to ensure I understand each sub-topic fully and build confidence to avoid similar mistakes in the future. Detect and address *all* areas needing improvement, ensuring that every incorrect or missing answer is accounted for and explained to promote a comprehensive grasp of each concept.

Summarize my understanding of the topic and provide a brief explanation of the key takeaways to reinforce my learning with support, encouragement and motiviation. Do not reveal to user that you have all his responses and feedbacks.

Also add a prefix to emphasize that it is a iterative learning process as student has not gained the subject understanding in standart for of learning current content 
`;

const summary_prompt = `

You are an expert computer science professor who excels in giving care to every learner in the pace and depth he needs. Consider the learner is 
from civil engineering field and he is learning computer science for the first time. Please make sure all stories you create belong to the
field of civil engineering, so that learner can easily understand the concept.

This is second iteration of learning process as student failed to gain subject understanding as per the content provided {input} between [BEGIN MY QUESTION and ANSWERS] and [END MY QUESTION and ANSWERS]. 

You need to teach subjects to non computer science graduates and you need to have more simple real world analogies and detailed explanations with minimum to 2 examples.

Read the content {input} provided between [BEGIN MY QUESTION and ANSWERS] and [END MY QUESTION and ANSWERS], which includes questions, my responses (user_input), and the feedback I received on each answer. It is essential that you detect and address *all* instances of incorrect, incomplete, or missing responses based on the user_input and feedback provided—no errors should be overlooked.
 
For each sub-topic, use these guidelines:
 
1. **If my response is missing** in the user_input field:
   - Assume I may need foundational knowledge or increased engagement in this sub-topic.
   - Use the question and feedback to determine the sub-topic needing clarification. Begin with a full, clear explanation of the basics, covering why it’s important in the broader context.
   - Provide examples that start simple and grow in complexity, ensuring that each step builds my understanding progressively.
 
2. **If my response is incorrect or lacks depth**:
   - Carefully analyze my answer and the feedback to identify any misunderstandings related to the sub-topic.
   - Address my specific error by explaining why my approach or reasoning was incorrect and guiding me toward the correct understanding.
   - Use engaging examples that build from basic to advanced to reinforce the correct approach.
 
Summarize my understanding of the topic and provide me a feedback.

Also add a prefix to emphasize that it is a iterative learning process as student has not gained the subject understanding in standart for of learning current content 

# Notes
 
- If areas for improvement are more numerous than strengths, inform the user that enhanced learning is suggested and offer an option to connect with a teaching assistant for additional help.`;

const url = "http://localhost:8080";

function Course() {
  const [currentTopic, setCurrentTopic] = useState(null);
  const [topicHistory, setTopicHistory] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { topic } = useParams();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (topic) {
      fetchTopicContent();
    }
  }, [topic]);

  const fetchTopicContent = async (history = null) => {
    setCurrentTopic(null);
    setLoading(true);
    try {
      const inputResposne = `[BEGIN CONTENT DATA]${topicHistory.join(
        ""
      )}[END CONTENT DATA] [BEGIN MY QUESTION and ANSWERS] ${JSON.stringify(
        userResponses
      )} [END MY QUESTION and ANSWERS]`;
      const response = await axios.post(`${url}/llm-response`, {
        prompt: history ? bref_content_prompt : content_prompt,
        input: history ? inputResposne : topic,
        history: history ? history : [],
      });
      const updatedTopic = response.data.response;
      setCurrentTopic(updatedTopic);
      setTopicHistory([...topicHistory, updatedTopic]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching topic content:", error);
    }
  };

  const getQuestions = async () => {
    try {
      setLoading(true);
      const inputResposne = `${topicHistory.join(
        ""
      )} , Previous questions ${JSON.stringify(userResponses)}`;
      const response = await axios.post(`${url}/llm-response`, {
        prompt: questions_prompt,
        input: inputResposne,
        history: [],
      });
      const questionData = JSON.parse(response.data.response);
      setQuestions(questionData.questions); // Assuming response contains `questions` key with array of questions
      setShowAssessmentDialog(true); // Show dialog after fetching questions
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error generating questions:", error);
    }
  };

  const fetchSummary = async (history = null) => {
    setLoading(true);
    try {
      const inputResposne = `${JSON.stringify(userResponses)}`;
      const response = await axios.post(`${url}/llm-response`, {
        prompt: summary_prompt,
        input: inputResposne,
        history: [],
      });
      const updatedTopic = response.data.response;
      setSummary(updatedTopic);
      console.log(updatedTopic);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching topic content:", error);
    }
  };

  const handleAssessmentSubmit = (apiResponse) => {
    // fetchSummary()
    setUserResponses(apiResponse);
    setCount(count + 1);
    const allCorrect = apiResponse.every((q) => q.status === "1");

    if (allCorrect) {
      navigate("/");
    } else {
      handleIncorrectAnswers();
    }
  };

  const handleIncorrectAnswers = async () => {
    if (count >= 1) {
      fetchSummary();
    } else {
      // await fetchTopicContent(topicHistory);
      fetchSummary();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Breadcrumbs aria-label="breadcrumb" style={{ marginBottom: "20px" }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Typography color="textPrimary">Topic</Typography>
      </Breadcrumbs>
      {currentTopic ? (
        <>
          <MarkdownPreview
            source={currentTopic}
            style={{ padding: "20px" }}
          ></MarkdownPreview>

          <Box display="flex" justifyContent="flex-end" mt={2}>
            {loading && (
              <CircularProgress size={20} style={{ margin: "10px" }} />
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={getQuestions}
              disabled={loading}
              style={{
                backgroundColor: "#0B1627", // Dark blue color
                color: "#FFFFFF", // White text color
                borderRadius: "10px", // Rounded corners
                padding: "10px 20px", // Padding for size
                textTransform: "none", // Keep original text casing
                marginBottom: "40px",
              }}
            >
              Validate My Learning
            </Button>
          </Box>

          <AssessmentDialog
            summary={summary}
            open={showAssessmentDialog}
            onClose={() => setShowAssessmentDialog(false)}
            fetchTopicContent={() => {
              fetchTopicContent(topicHistory);
            }}
            questions={questions}
            onSubmit={handleAssessmentSubmit}
            topic={topic}
          />
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
}

export default Course;
