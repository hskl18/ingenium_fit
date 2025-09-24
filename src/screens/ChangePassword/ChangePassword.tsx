import type { RootScreenProps } from "@/navigation/types.ts";
import type { IResponseData } from "@/services/types";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import { storage } from "@/storage";
import { changePassword } from "@/services";
import { Configs } from "@/common/configs.ts";
import { z } from "zod";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function Login({
  navigation,
}: RootScreenProps<Paths.ChangePassword>) {
  const { navigationTheme, backgrounds } = useTheme();

  const [parameters, setParameters] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const FormSchema = z.object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z.string().min(1, { message: "New password is required" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Confirm new password is required" }),
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

  const mutation = useMutation({
    mutationFn: changePassword,
    onError: async (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        storage.delete(Configs.Token);
        Toast.show("Password changed successfully", {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          onHidden: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: Paths.Login }],
            });
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={90}
    >
      <ScrollView style={[styles.scrollView, backgrounds.gray1550]}>
        <SafeScreen edges={["bottom"]}>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={40}
                autoComplete="new-password"
                label=""
                onChangeText={(text) => {
                  handleUpdateParameters(text, "oldPassword");
                }}
                placeholder={"Enter old password"}
                secureTextEntry
                style={[backgrounds.gray1600]}
                textContentType="newPassword"
                underlineColor="transparent"
                value={parameters.oldPassword}
              />
            </View>
            <Divider />

            <View style={styles.inputContainer}>
              <TextInput
                maxLength={40}
                autoComplete="new-password"
                label=""
                onChangeText={(text) => {
                  handleUpdateParameters(text, "newPassword");
                }}
                placeholder={"Enter new password"}
                secureTextEntry
                style={[backgrounds.gray1600]}
                textContentType="newPassword"
                underlineColor="transparent"
                value={parameters.newPassword}
              />
            </View>
            <Divider />

            <View style={styles.inputContainer}>
              <TextInput
                maxLength={40}
                autoComplete="new-password"
                label=""
                onChangeText={(text) => {
                  handleUpdateParameters(text, "confirmNewPassword");
                }}
                placeholder={"Confirm new password"}
                secureTextEntry
                style={[backgrounds.gray1600]}
                textContentType="newPassword"
                underlineColor="transparent"
                value={parameters.confirmNewPassword}
              />
            </View>
            <View style={styles.linkContainer}>
              <Button
                labelStyle={styles.linkText}
                mode="text"
                onPress={() => {
                  navigation.push(Paths.ForgotPassword);
                }}
                textColor={navigationTheme.colors.primary}
              >
                {"Forgot Password"}
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                loading={mutation.isPending}
                contentStyle={styles.signInButton}
                labelStyle={styles.signInButtonLabel}
                mode="contained"
                onPress={handleSubmit}
              >
                {"Confirm"}
              </Button>
            </View>
          </View>
        </SafeScreen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 62,
    paddingHorizontal: 15,
  },
  container: {
    paddingTop: 10,
  },
  inputContainer: {},
  linkContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 34,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
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
  textInputOutline: {
    borderRadius: 16,
  },
});
