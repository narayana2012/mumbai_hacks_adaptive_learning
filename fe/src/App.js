import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useSearchParams,
} from "react-router-dom";
import Detail from "./Detail";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Container,
} from "@mui/material";
import Header from "./Header";
import Course from "./Course";
import AiTutor from "./AiTutor";
import Intro from "./Intro";

const Home = () => {
  let [searchParams, setSearchParams] = useSearchParams();

  const field = searchParams.get("field");

  const items = [
    { id: 1, name: "Lists" },
    { id: 2, name: "Tuples" },
    { id: 3, name: "Dictionaries" },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Python Programming
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              component={Link}
              to={`/course/topic/${item.name}?field=${field}`}
              sx={{ background: "#fff", border: "1px solid #eee", mb: 2 }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} /> {/* Home page with item list */}
        <Route path="/home" element={<Home />} />{" "}
        {/* Home page with item list */}
        <Route path="/detail/:id" element={<Detail />} />{" "}
        {/* Detail page without item list */}
        <Route path="/course/topic/:topic" element={<Course />} />
        <Route path="/ai-tutor/:course/:topic" element={<AiTutor />} />
      </Routes>
    </Router>
  );
};

export default App;
