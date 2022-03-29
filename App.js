import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Linking } from "react-native";
import styled from "styled-components/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Clipboard from "@react-native-clipboard/clipboard";
import Snackbar from "react-native-snackbar";
import Tts from "react-native-tts";

Tts.setDefaultLanguage("en-US");
Tts.setDefaultVoice("com.apple.ttsbundle.Samantha-compact");
Tts.setDefaultRate(0.6);
Tts.setDefaultPitch(1.2);

export default function App() {
  const [Quote, setQuote] = useState("Loading...");
  const [Author, setAuthor] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(false);

  const randomQuote = () => {
    setIsLoading(true);
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((result) => {
        setQuote(result.content);
        setAuthor(result.author);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    randomQuote();
  }, []);

  const speakNow = () => {
    try {
      Tts.stop();
      Tts.speak(Quote + "by" + Author);
      Tts.addEventListener("tts-start", () => setIsSpeaking(true));
      Tts.addEventListener("tts-finish", () => setIsSpeaking(false));
    } catch (e) {
      console.log(e);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(Quote);
    Snackbar.show({
      text: "Quote Copied!",
      duration: Snackbar.LENGTH_SHORT,
    });
  };

  const tweetNow = () => {
    const url = "https://twitter.com/intent/tweet?text=" + Quote;
    Linking.openURL(url);
  };

  return (
    <Screen>
      <Card>
        <HeaderTitle>Quote Of The Day</HeaderTitle>
        <TopLeftIcon name="quote-left"></TopLeftIcon>
        <Title>{Quote}</Title>
        <BottomRightIcon name="quote-right"></BottomRightIcon>
        <AuthorTitle>------- {Author}</AuthorTitle>
        <ChangeQuoteButton onPress={randomQuote}>
          <ButtonTitle> {isLoading ? "Loading.." : "New Quote"} </ButtonTitle>
        </ChangeQuoteButton>
        <ButtonsContainer>
          <BottomButtons onPress={speakNow}>
            <ButtonIcons name="volume-up"/>
          </BottomButtons>
          <BottomButtons onPress={copyToClipboard}>
            <ButtonIcons name="copy"/>
          </BottomButtons>
          <BottomButtons onPress={tweetNow}>
            <ButtonIcons name="twitter"/>
          </BottomButtons>
        </ButtonsContainer>
      </Card>
      <StatusBar style="auto" />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background: #20A4F3;
`;
const Card = styled.View`
  background: #fef9ef;
  width: 90%;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 30px 30px black;
  elevation:20;
`;
const HeaderTitle = styled.Text`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: black;
  margin-bottom: 20px;
`;
const Title = styled.Text`
  text-align: center;
  font-size: 17px;
  color: black;
  line-height: 30px;
  letter-spacing: 1.1px;
  margin-bottom: 10px;
  padding: 0px 18px;
`;
const ChangeQuoteButton = styled(TouchableOpacity)`
  background: #F55D3E;
  padding: 20px;
  border-radius: 20px;
  margin-vertical: 20px;
`;
const ButtonTitle = styled.Text`
  text-align: center;
  font-size: 18px;
  color: white;
`;
const AuthorTitle = styled.Text`
  text-align: right;
  font-style: italic;
  font-size: 16px;
`;
const TopLeftIcon = styled(FontAwesome5)`
  font-size: 20px;
  margin-bottom: -12px;
`;
const BottomRightIcon = styled(FontAwesome5)`
  font-size: 20px;
  text-align: right;
  margin-bottom: 15px;
  margin-top: -22px;
`;
const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
const BottomButtons = styled.TouchableOpacity`
  border-width: 2px;
  border-radius: 40px;
  padding: 10px;
`;
const ButtonIcons = styled(FontAwesome5)`
  font-size: 22px;
  color: black;
  text-align: center;
`;
