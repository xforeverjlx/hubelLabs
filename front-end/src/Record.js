import React, { useEffect } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import './style.css'

const useScript = url => {
    useEffect(() => {
      const script = document.createElement('script');
  
      script.src = url;
      script.async = true;
  
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      }
    }, [url]);
  };

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(to bottom, #f05053, #e1eec3);
    height: 100%;
    margin: 0;
    color: #555;
  }
`;

const sharedStyles = css`
  background-color: #eee;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin: 10px 0 20px 0;
  padding: 20px;
  box-sizing: border-box;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
`;

function App() {
    useScript("https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js");
    useScript("https://sdk.amazonaws.com/js/aws-sdk-2.357.0.min.js");
    useScript("./app.js");
    window.onbeforeunload = function() {
        return "You can not refresh";
    }
    return(
        <>
        <GlobalStyle />
            <StyledFormWrapper>
                <StyledForm>
                <h2>Instructions</h2>
          <p>Please record your child reading each of these words/phrases and click Submit to move onto the next word.</p>
          <p>It does not matter if the pronunciation is not perfect or correct. You can still submit.</p>
          <p>Our annotator will score the pronunciations before using it to train the AI engine.</p>
          <h2>Audio Recorder</h2>
            <p>Please hold the record button and have your child read this out loud:</p>
	<div id="centerInitText">
		<p><span id="initText"> </span></p>
	</div>
	
	
	<div className="smallButton">		
		<div id="controls">
			<button id="skipButton">Skip Word</button>
		</div>
	</div>
	
	<div>
		<div id="controls">
			<button id="recordButton">Record</button>
			<button id="stopButton" disabled>Stop</button>
		</div>
		
		<ol id="recordingsList"></ol>

		<div id="controls">
			<button id="submitButton">Submit & Next</button>
		</div>
	</div>
    </StyledForm>
    </StyledFormWrapper>
        </>
    );
}

export default App;