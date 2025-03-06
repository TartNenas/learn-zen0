import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import quizData from '../data/quizData.json';
import { Question } from '../types/quiz';

const QuizContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

const OptionButton = styled.button<{ $isSelected?: boolean }>`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  position: relative;
  border: none;
  border-radius: 8px;
  background-color: #e8f0fe;
  color: #1a73e8;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.$isSelected ? 
      'conic-gradient(from 0deg, #ff9aa2, #ffb7b2, #ffdac1, #e2f0cb, #a2e4ff, #c9afff, #ffb7b2, #ff9aa2)' : 
      'transparent'};
    border-radius: 10px;
    z-index: -1;
    transition: all 0.3s ease;
    opacity: ${props => props.$isSelected ? '1' : '0'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #e8f0fe;
    border-radius: 7px;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-2px);
    background-color: #d2e3fc;
    &::before {
      opacity: 1;
      background: conic-gradient(from 0deg, #ff9aa2, #ffb7b2, #ffdac1, #e2f0cb, #a2e4ff, #c9afff, #ffb7b2, #ff9aa2);
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultText = styled.p<{ $isCorrect?: boolean }>`
  color: ${props => props.$isCorrect ? '#4CAF50' : '#f44336'};
  font-weight: bold;
  margin-top: 1rem;
`;

const NextButton = styled.button`
  background-color: #1a73e8;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(26, 115, 232, 0.2);

  &:hover {
    transform: translateY(-2px);
    background-color: #1557b0;
    box-shadow: 0 4px 8px rgba(26, 115, 232, 0.3);
  }

  &:active {
    transform: translateY(0);
    background-color: #1a73e8;
  }
`;

const ScoreText = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  margin-top: 1rem;
`;

const CompletionContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const BadgeContainer = styled.div`
  margin: 2rem auto;
  position: relative;
  width: 150px;
  height: 150px;
  animation: badge-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  @keyframes badge-pop {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Badge = styled.div`
  width: 100%;
  height: 100%;
  background: conic-gradient(from 0deg, #ff9aa2, #ffb7b2, #ffdac1, #e2f0cb, #a2e4ff, #c9afff, #ffb7b2, #ff9aa2);
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotate 10s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const BadgeInner = styled.div`
  background: white;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: none;
`;

const BadgeScore = styled.h2`
  color: #1a73e8;
  font-size: 2rem;
  margin: 0;
`;

const BadgeText = styled.p`
  color: #333;
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const CompletionTitle = styled.h2`
  color: #1a73e8;
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: slide-up 0.5s ease;

  @keyframes slide-up {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const PlayAgainButton = styled(NextButton)`
  margin-top: 2rem;
`;

const CompleteButton = styled(NextButton)`
  background-color: #4CAF50;
  margin-left: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions: Question[] = quizData.questions;

  useEffect(() => {
    if (currentQuestion >= questions.length) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Confetti will show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, questions.length]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestion(prev => prev + 1);
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowConfetti(false);
  };

  const handleComplete = () => {
    setCurrentQuestion(questions.length);
  };

  const getAchievementText = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return "Perfect Score! 🏆";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 60) return "Good Job! 👍";
    return "Keep Learning! 📚";
  };

  const isLastQuestion = currentQuestion === questions.length - 1;

  if (currentQuestion >= questions.length) {
    return (
      <QuizContainer>
        {showConfetti && <Confetti 
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />}
        <CompletionContainer>
          <CompletionTitle>Quiz Completed!</CompletionTitle>
          <BadgeContainer>
            <Badge>
              <BadgeInner>
                <BadgeScore>{score}/{questions.length}</BadgeScore>
                <BadgeText>{getAchievementText(score, questions.length)}</BadgeText>
              </BadgeInner>
            </Badge>
          </BadgeContainer>
          <ScoreText>Your score: {score} out of {questions.length}</ScoreText>
          <PlayAgainButton onClick={handlePlayAgain}>
            Play Again
          </PlayAgainButton>
        </CompletionContainer>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <QuestionText>
        Question {currentQuestion + 1}: {questions[currentQuestion].question}
      </QuestionText>
      
      {questions[currentQuestion].options.map((option, index) => (
        <OptionButton
          key={index}
          onClick={() => handleAnswerSelect(option)}
          $isSelected={selectedAnswer === option}
          disabled={showResult}
        >
          {option}
        </OptionButton>
      ))}

      {showResult && (
        <>
          <ResultText $isCorrect={selectedAnswer === questions[currentQuestion].correctAnswer}>
            {selectedAnswer === questions[currentQuestion].correctAnswer 
              ? "Correct!" 
              : "Incorrect! The correct answer is: " + questions[currentQuestion].correctAnswer}
          </ResultText>
          {isLastQuestion ? (
            <ButtonGroup>
              <CompleteButton onClick={handleComplete}>
                Complete Quiz
              </CompleteButton>
            </ButtonGroup>
          ) : (
            <NextButton onClick={handleNextQuestion}>
              Next Question
            </NextButton>
          )}
        </>
      )}

      <ScoreText>Current Score: {score}/{currentQuestion + 1}</ScoreText>
    </QuizContainer>
  );
};

export default Quiz; 