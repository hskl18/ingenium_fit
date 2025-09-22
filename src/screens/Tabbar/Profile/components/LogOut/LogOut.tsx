import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import Toast from "react-native-root-toast";
import { useTranslation } from "@/hooks";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { storage } from "@/storage";
import { logout } from "@/services";
import { Configs } from "@/common/configs.ts";

export default function LogOut({
  hideModal,
  visible,
}: {
  readonly hideModal: () => void;
  readonly visible: boolean;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { backgrounds, colors } = useTheme();
  const containerStyle = {
    backgroundColor: "transparent",
    bottom: 0,
    left: 0,
    padding: 20,
    position: "absolute",
    right: 0,
  };

  const mutation = useMutation({
    mutationFn: logout,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      hideModal();
      if (response.code === 200) {
        storage.delete(Configs.Token);
        Toast.show(t("common.logout_success"), {
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

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <Portal>
      <Modal
        contentContainerStyle={containerStyle}
        onDismiss={hideModal}
        visible={visible}
      >
        <View style={[styles.container, backgrounds.gray1600]}>
          <Text style={styles.titleText}>
            {t("common.logout_confirmation")}
          </Text>
        </View>
        <Button
          buttonColor={colors.gray1600}
          contentStyle={[styles.button]}
          loading={mutation.isPending}
          mode="text"
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>{t("common.log_out")}</Text>
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 18,
    height: 50,
    justifyContent: "center",
  },

  buttonText: {
    color: "#F2262F",
    fontSize: 15,
    fontWeight: "bold",
  },
  closeIcon: {
    height: 14,
    width: 14,
  },
  container: {
    borderRadius: 18,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 18,
  },
  titleText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "bold",
  },
});
