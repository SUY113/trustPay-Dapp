import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdvancePaymentResponse.css";

function AdvancePaymentResponse() {
  const [userName, setUserName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [requestID, setRequestID] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [amountToken, setAmountToken] = useState("");
  const [response, setResponse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedOrgName = localStorage.getItem("orgName");
    if (storedUserName && storedOrgName) {
      setUserName(storedUserName);
      setOrgName(storedOrgName);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const storedRequestID = localStorage.getItem("requestId");
    const storedTargetAccount = localStorage.getItem("targetAccount");
    const storedAmountToken = localStorage.getItem("amountToken");
    if (storedAmountToken && storedRequestID && storedTargetAccount) {
      setRequestID(storedRequestID);
      setTargetAccount(storedTargetAccount);
      setAmountToken(storedAmountToken);
    } else {
      setErrorMessage("Không có yêu cầu ứng tiền");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3000/respond-request", {
        userName: userName,
        orgName: orgName,
        requestID: requestID,
        response: response,
      });

      setSuccessMessage("Response submitted successfully.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to submit response.");
      setSuccessMessage("");
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard-Staff");
  };

  return (
    <div className="response-form-container">
      <h2>Submit Response Advance Payment</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          userName:
          <input type="text" value={userName} readOnly />
        </label>
        <label>
          OrgName:
          <input type="text" value={orgName} readOnly />
        </label>
        <label>
          Request ID:
          <input type="text" value={requestID} readOnly />
        </label>
        <label>
          Targer Account
          <input type="text" value={targetAccount} readOnly />
        </label>
        <label>
          Amount Token
          <input type="text" value={amountToken} readOnly />
        </label>
        <label>
          Response:
          <select
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            required
          >
            <option value="">Select a response</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <button type="submit">Submit Response</button>
      </form>
      <button className="back-button" onClick={handleBackClick}>
        Back
      </button>
    </div>
  );
}

export default AdvancePaymentResponse;
