import WheelPicker from "@quidone/react-native-wheel-picker";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { dynamicsCategoryList } from "@/services";
import Empty from "@/components/common/Empty/Empty.tsx";
import { useTranslation } from "@/hooks";

export default function SelectCategory({ ref, onChange }) {
  const [categoryList, setCategoryList] = useState([]);
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const { backgrounds, colors } = useTheme();

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setVisible(true);
      },
    };
  }, []);

  const { data, isSuccess } = useQuery({
    queryFn: dynamicsCategoryList,
    queryKey: [Paths.DynamicPublish, "dynamicsCategoryList"],
  });
  useEffect(() => {
    console.log("data", data);
    console.log("visible", visible);
    if (isSuccess) {
      setCategoryList(data.data || {});
      setValue(data.data?.[0]?.id || "");
    }
  }, [setCategoryList, data, isSuccess]);

  const hideModal = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    console.log("handleSubmit: ", value);

    onChange(categoryList.find((item) => item.id === value));
    hideModal();
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={hideModal}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.containerStyle}>
        <TouchableOpacity onPress={hideModal} style={{ flex: 1 }} />
        <View style={[styles.container, backgrounds.gray1600]}>
          <View style={[styles.header, backgrounds.gray1550]}>
            <Button textColor={colors.gray800} onPress={hideModal}>
              {"Cancel"}
            </Button>
            <Text style={styles.title}> {"Select"}</Text>
            <Button onPress={handleSubmit}> {"Confirm"}</Button>
          </View>
          <WheelPicker
            data={categoryList.map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
            itemTextStyle={{
              fontSize: 15,
              fontWeight: 500,
            }}
            onValueChanged={({ item: { value } }) => setValue(value)}
            value={value}
          />
          {categoryList.length <= 0 ? <Empty /> : undefined}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {},
  containerStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 17,
    fontWeight: 500,
  },
});
