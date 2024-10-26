import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import AssessmentDialog from './AssessmentDialog';
import { Button } from '@mui/material';

const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [openAssessment, setOpenAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Helper function to extract query parameters
  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  const name = getQueryParam('name');

  useEffect(() => {
    const fetchMarkdown = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}?name=${encodeURIComponent(name)}`);
        const result = await response.json();
        setMarkdown(result.body || '');
      } catch (error) {
        console.error('Error fetching markdown data:', error);
      }
      setLoading(false);
    };

    fetchMarkdown();
  }, [id, name]);


  const questions = [
    { question: "text of question 1", answer: "answer of question 1" },
    { question: "text of question 2", answer: "answer of question 2" },
    { question: "text of question 3", answer: "answer of question 3" },
  ];

  const handleAssessmentSubmit = (apiResponse) => {
    setAssessmentResult(apiResponse); 
    setOpenAssessment(false); 
  };

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Button
            variant="contained"
            component={Link}
            to="/"
            style={{ margin: '20px 0' }}
          >
            Home
          </Button>
         
          <ReactMarkdown>{markdown}</ReactMarkdown>



          <button
            style={{ marginTop: '20px' }}
            onClick={() => setOpenAssessment(true)}
          >
            Take Assessment
          </button>

          <AssessmentDialog
            open={openAssessment}
            questions={questions}
            onClose={() => setOpenAssessment(false)}
            onSubmit={handleAssessmentSubmit}
          />

          {assessmentResult && (
            <div style={{ marginTop: '20px' }}>
              <h3>API Response:</h3>
              <pre>{JSON.stringify(assessmentResult, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detail;
