import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  Row,
  Col,
  Container,
  Button,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Task from "../src/utils/task";

function App() {
  const [rangeValue, setRangeValue] = useState(0);
  const [showToast, setShowToast] = useState({
    visibility: false,
    message: "",
  });
  const [responseData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const taskLogic = () => {
    console.log("Executing task logic...");
  };

  const sendDataHandler = async () => {
    setLoading(true); // Set loading state to true when sending data
    if (rangeValue <= 0) {
      setShowToast({
        visibility: true,
        message: "Range must be greater than 0.",
      });
      setLoading(false); // Reset loading state
      return;
    }
    const dummyData = [];
    for (let i = 1; i <= rangeValue; i++) {
      const id = uuidv4();
      const priority = getRandomInt(1, 3);
      const status = "pending";
      const task = new Task(id, priority, status, taskLogic);
      dummyData.push(task);
    }

    try {
      const response = await axios.post(
        "http://localhost:9999/getTasks",
        dummyData
      );
      console.log(dummyData);
      console.log(response.data);
      setResponseData(response.data);
      setShowToast({ visibility: true, message: "Data sent successfully!" });
      setRangeValue(0);
    } catch (error) {
      console.log(error);
      setShowToast({
        visibility: true,
        message: "Failed to send data to the server",
      });
    } finally {
      setLoading(false); // Reset loading state after response or error
    }
  };

  const rangeUpdateHandler = (e) => {
    setRangeValue(e.target.value);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <h1 className="text-center">Multithreaded Task Scheduler</h1>
            <>
              <Form.Label>Range</Form.Label>
              <Form.Range
                min={0}
                max={200}
                value={rangeValue}
                onChange={rangeUpdateHandler}
                style={{ color: "blue" }}
              />
            </>
            <Button
              variant="primary"
              onClick={sendDataHandler}
              disabled={loading}
            >
              {loading ? "Sending Data..." : `Send ${rangeValue} Tasks`}
            </Button>
            <ToastContainer
              position="top-end"
              className="p-3"
              style={{ zIndex: 1 }}
            >
              <Toast
                show={showToast.visibility}
                onClose={() => setShowToast({ visibility: false, message: "" })}
              >
                <Toast.Header>
                  <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                  />
                  <strong className="me-auto">@utkkkarshhh</strong>
                </Toast.Header>
                <Toast.Body>{showToast.message}</Toast.Body>
              </Toast>
            </ToastContainer>
            {responseData && (
              <div>
                <h2>Response from Server: (Sent Tasks and Scheduled Tasks)</h2>
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
