import type { RootScreenProps } from "@/navigation/types.ts";
import { Rating } from "@kolking/react-native-rating";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Image,
  ImageURISource,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import starIcon from "@/assets/images/244.png";
import RemoveIcon from "@/assets/images/159.png";
import UploadIcon from "@/assets/images/235.png";
import { addComment, uploadFile } from "@/services";
import { z } from "zod";
import AWSHelper from "@/services/mock/upload";
// Conditionally import ImagePicker
let ImagePicker: any = null;
try {
  const imagePickerModule = require("react-native-image-crop-picker");
  ImagePicker = imagePickerModule?.default ?? imagePickerModule;
} catch (error) {
  console.warn("ImagePicker not available in Expo Go");
}

export default function RehabilitationCenterEvaluate({
  navigation,
  route,
}: RootScreenProps<Paths.RehabilitationCenterEvaluate>) {
  const { backgrounds, colors } = useTheme();
  const { id, name, coverImage } = route.params;

  console.log("id", id);
  const [images, setImages] = useState<string[]>([]);
  const [parameters, setParameters] = useState({
    content: "",
    images: "",
    star: 5,
    objectId: id,
    objectType: 3,
  });

  const FormSchema = z.object({
    content: z.string().min(1, { message: "Please enter your evaluation" }),
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
    mutationFn: addComment,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        Toast.show("Submitted", {
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
    value: boolean | string | number,
    name: keyof typeof parameters
  ) => {
    console.log(value, name);
    setParameters((parameters) => ({
      ...parameters,
      [name]: value,
    }));
  };

  const handleUploadImage = async () => {
    console.log("handleUploadImage");
    ImagePicker.openPicker({
      mediaType: "photo",
      maxFiles: 3 - images.length,
      multiple: 3 - images.length > 1,
    })
      .then(async (result) => {
        console.log("result", result);
        if (Array.isArray(result)) {
          result.forEach(async (result) => {
            const file = {
              uri: result.path,
              name: result.filename,
              type: result.mime,
            };
            const res = await AWSHelper.uploadFile(file);
            console.log("res", res);
            if (res?.data) {
              setImages((newImages) => [...newImages, res.data]);
            }
          });
        } else {
          const file = {
            uri: result.path,
            name: result.filename,
            type: result.mime,
          };
          const res = await AWSHelper.uploadFile(file);
          console.log("res", res);
          if (res?.data) {
            setImages((newImages) => [...newImages, res.data]);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleSubmit = () => {
    console.log(parameters);
    if (!checkForm()) {
      return;
    }
    mutation.mutate({
      ...parameters,
      images: images.join(","),
    });
  };

  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1550]}>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1550]}
      >
        <View style={[styles.container, backgrounds.gray1600]}>
          <View style={[styles.titleWrapper, backgrounds.gray1550]}>
            <Image
              source={{
                uri: coverImage,
              }}
              style={styles.titleImage}
            />
            <Text style={styles.titleText}>{name}</Text>
          </View>
          <View style={styles.starWrapper}>
            <Text>评分</Text>
            <Rating
              size={22}
              rating={parameters.star}
              fillColor="#333"
              touchColor="#000"
              onChange={(value) => {
                handleUpdateParameters(value, "star");
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              maxLength={200}
              label=""
              multiline
              onChangeText={(text) => {
                handleUpdateParameters(text, "content");
              }}
              placeholder={"Please enter text review"}
              style={[styles.textInput, backgrounds.gray1550]}
              underlineColor="transparent"
              value={parameters.content}
            />
            <View style={styles.inputNumberButtonContainer}>
              <Button mode="text" textColor={colors.gray800}>
                {parameters.content.length}/200
              </Button>
            </View>
          </View>
          <View style={styles.uploadIconWrapper}>
            {images.map((item, index) => (
              <View key={item} style={styles.pictureItem}>
                <Image source={{ uri: item }} style={styles.picture} />
                <Pressable
                  onPress={() => {
                    setImages((newImages) =>
                      newImages.filter((_, index_) => index_ !== index)
                    );
                  }}
                  style={styles.removeIconWrapper}
                >
                  <Image
                    source={RemoveIcon as ImageURISource}
                    style={styles.removeIcon}
                  />
                </Pressable>
              </View>
            ))}
            {images.length < 3 ? (
              <Pressable onPress={handleUploadImage} style={styles.pictureItem}>
                <Image
                  source={UploadIcon as ImageURISource}
                  style={styles.uploadIcon}
                />
              </Pressable>
            ) : undefined}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            loading={mutation.isPending}
            mode="contained"
            onPress={handleSubmit}
          >
            {"Submit"}
          </Button>
        </View>
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 74,
  },
  container: {
    borderRadius: 12,
    paddingBottom: 18,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  inputContainer: {
    marginBottom: 5,
    marginTop: 18,
  },
  inputNumberButtonContainer: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
  picture: {
    borderRadius: 10,
    height: 80,
    width: 80,
  },
  pictureItem: {
    height: 80,
    marginTop: 10,
    width: 80,
  },
  removeIcon: {
    height: 18,
    width: 18,
  },
  removeIconWrapper: {
    height: 18,
    position: "absolute",
    right: 0,
    top: 0,
    width: 18,
  },
  safeScreen: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  scrollView: {
    flex: 1,
  },
  selectText: {
    fontSize: 15,
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
    borderRadius: 10,
    minHeight: 113,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleImage: {
    height: 40,
    width: 40,
    borderRadius: 12,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 500,
  },
  titleWrapper: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  starWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  upload: {
    marginTop: 32,
  },
  uploadDescText: {
    fontSize: 12,
    marginTop: 6,
  },
  uploadIcon: {
    borderRadius: 10,
    height: 80,
    width: 80,
  },
  uploadIconWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
});
