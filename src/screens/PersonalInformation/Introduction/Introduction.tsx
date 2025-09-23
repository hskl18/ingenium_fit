import type { RootScreenProps } from "@/navigation/types.ts";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import { editUserInfo } from "@/services";
import { useUserStore } from "@/store";
import { z } from "zod";

export function Introduction({
  navigation,
}: RootScreenProps<Paths.Introduction>) {
  const userInfo = useUserStore((state) => state.userInfo);
  const { backgrounds } = useTheme();
  const [parameters, setParameters] = useState({
    introduction: userInfo.introduction ?? "",
  });

  const FormSchema = z.object({
    introduction: z
      .string()
      .min(1, { message: "Please enter an introduction" }),
  });

  const checkForm = (): boolean => {
    const result = FormSchema.safeParse(parameters);
    if (!result.success) {
      const flattenError = z.flattenError(result.error);
      console.log(
        flattenError.fieldErrors[Object.keys(flattenError.fieldErrors)[0]]
      );
      const msg: string =
        flattenError.fieldErrors[
          Object.keys(flattenError.fieldErrors)[0]
        ]?.[0] || "";
      msg &&
        Toast.show(msg, {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
    }
    return result.success;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editUserInfo,
    onSuccess: (response: IResponseData) => {
      queryClient.refetchQueries({
        queryKey: [Paths.PersonalInformation, "getLoginUser"],
        type: "active",
      });
      if (response.code === 200) {
        Toast.show("Saved successfully", {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            navigation.goBack();
          },
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const handleUpdateParameters = (
    value: string,
    name: keyof typeof parameters
  ) => {
    setParameters((parameters) => ({
      ...parameters,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(parameters);
    if (!checkForm()) {
      return;
    }
    mutation.mutate(parameters);
  };

  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1550]}>
      <SafeScreen edges={["bottom"]} style={[backgrounds.gray1550]}>
        <View>
          <TextInput
            maxLength={255}
            label=""
            multiline
            onChangeText={(text) => {
              handleUpdateParameters(text, "introduction");
            }}
            placeholder={"Enter introduction"}
            style={[styles.textInput, backgrounds.gray1600]}
            underlineColor="transparent"
            value={parameters.introduction}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            loading={mutation.isPending}
            mode="contained"
            onPress={handleSubmit}
          >
            {"Save"}
          </Button>
        </View>
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 108,
    paddingHorizontal: 15,
  },
  scrollView: {
    flex: 1,
  },
  signInButton: {
    alignItems: "center",
    height: 49,
    justifyContent: "center",
  },
  signInButtonLabel: {
    fontSize: 17,
    fontWeight: "bold",
  },
  textInput: {
    minHeight: 150,
  },
  textInputOutline: {
    borderRadius: 16,
  },
});
