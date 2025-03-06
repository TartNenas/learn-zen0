import React from 'react';
import styled from 'styled-components';
import Quiz from './components/Quiz';
import Pattern from './components/Pattern.tsx';

const AppWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Update Quiz component styling to ensure it stands out against the background
const StyledQuiz = styled(Quiz)`
  position: relative;
  z-index: 2;
`;

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const App: React.FC = () => {
  return (
    <AppWrapper>
      <BackgroundWrapper>
        <Pattern />
      </BackgroundWrapper>
      <ContentContainer>
        <Title>Interactive Quiz App</Title>
        <StyledQuiz />
      </ContentContainer>
    </AppWrapper>
  );
};

export default App;
