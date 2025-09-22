import React, { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, RadioButton, Text } from "react-native-paper";
import { Analytics } from "@/utils";

type Properties = {
  visible: boolean;
  onDismiss: () => void;
};

export default function SurveyPrompt({ visible, onDismiss }: Properties) {
  const [confidence, setConfidence] = useState<string>("3");

  const handleSubmit = async () => {
    await Analytics.action("survey_submit", { confidence });
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Quick research survey</Dialog.Title>
        <Dialog.Content>
          <Text>
            How confident do you feel about participating in adaptive sports
            after using the app?
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setConfidence(value)}
            value={confidence}
          >
            <View style={{ marginTop: 12 }}>
              {["1", "2", "3", "4", "5"].map((value) => (
                <View
                  key={value}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <RadioButton value={value} />
                  <Text> {value}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Later</Button>
          <Button mode="contained" onPress={handleSubmit}>
            Submit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
