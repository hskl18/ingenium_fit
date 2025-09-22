import type { RootScreenProps } from "@/navigation/types.ts";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import { editUserInfo } from "@/services";
import { useUserStore } from "@/store";
import { z } from "zod";

export default function Nickname({
  navigation,
}: RootScreenProps<Paths.Nickname>) {
  const userInfo = useUserStore((state) => state.userInfo);
  const { backgrounds } = useTheme();  const queryClient = useQueryClient();
  const [parameters, setParameters] = useState({
    nickName: userInfo.nickName ?? "",
  });

  const FormSchema = z.object({
    nickName: z.string().min(1, { message: t("message.nickname") }),
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
    mutationFn: editUserInfo,
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        queryClient.refetchQueries({
          queryKey: [Paths.PersonalInformation, "getLoginUser"],
          type: "active",
        });

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
            maxLength={20}
            label=""
            onChangeText={(text) => {
              handleUpdateParameters(text, "nickName");
            }}
            placeholder={t("input.nickname")}
            style={[backgrounds.gray1600]}
            underlineColor="transparent"
            value={parameters.nickName}
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
            {t("common.save")}
          </Button>
        </View>
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 232,
    paddingHorizontal: 15,
  },
  labelText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "bold",
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
