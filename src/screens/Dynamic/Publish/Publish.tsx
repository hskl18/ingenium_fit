import type { RootScreenProps } from "@/navigation/types.ts";

import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import {
  Image,
  ImageURISource,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
// Conditionally import ImagePicker
let ImagePicker: any = null;
try {
  ImagePicker = require("react-native-image-crop-picker").default;
} catch (error) {
  console.warn("ImagePicker not available in Expo Go");
}
import { Button, Switch, Text, TextInput } from "react-native-paper";
import Toast from "react-native-root-toast";
import { Pressable } from "react-native-gesture-handler";
import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";
import { z } from "zod";
import { SafeScreen } from "@/components/templates";
import SelectCategory from "@/screens/Dynamic/components/SelectCategory/SelectCategory.tsx";

import ArrowIcon from "@/assets/images/158.png";
import RemoveIcon from "@/assets/images/159.png";
import UploadIcon from "@/assets/images/235.png";
import { publishPost, uploadFile } from "@/services";
// Conditionally import media console components
let useAnimations: any = () => ({});
let VideoPlayer: any = null;
try {
  useAnimations =
    require("@react-native-media-console/reanimated").useAnimations;
  VideoPlayer = require("react-native-media-console").default;
} catch (error) {
  console.warn("Media console not available in Expo Go");
  VideoPlayer = ({ children, ...props }: any) => children;
}
import AWSHelper from "@/services/mock/upload";

export default function DynamicPublish({
  navigation,
}: RootScreenProps<Paths.DynamicPublish>) {  const { backgrounds, colors } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pictures, setPictures] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [parameters, setParameters] = useState({
    content: "",
    dynamicsPostCategory: "",
    dynamicsPostCategoryId: "",
    pictures: "",
    videos: "",
    whetherPublic: true,
  });

  const selectCategoryReference = useRef<null | typeof SelectCategory>(null);

  const FormSchema = z.object({
    dynamicsPostCategoryId: z
      .string()
      .min(1, { message: t("message.classification") }),
    content: z.string().min(1, { message: t("message.content") }),
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
    mutationFn: publishPost,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        Toast.show(t("common.publish_success"), {
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
    value: boolean | string,
    name: keyof typeof parameters
  ) => {
    console.log(value, name);
    setParameters((parameters) => ({
      ...parameters,
      [name]: value,
    }));
  };

  const handleSelectCategory = ({ id, name }: { id: string; name: string }) => {
    handleUpdateParameters(id, "dynamicsPostCategoryId");
    handleUpdateParameters(name, "dynamicsPostCategory");
  };

  const handleUploadImage = async () => {
    console.log("handleUploadImage");

    ImagePicker.openPicker({
      mediaType: "photo",
      multiple: true,
    })
      .then((result) => {
        console.log("result", result);
        result.forEach(async (result) => {
          const file = {
            uri: result.path,
            name: result.filename,
            type: result.mime,
          };
          const res = await AWSHelper.uploadFile(file);
          console.log("res", res);
          if (res?.data) {
            setPictures((newPictures) => [...newPictures, res.data]);
          }
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const handleUploadVideo = async () => {
    console.log("handleUploadVideo");
    ImagePicker.openPicker({
      mediaType: "video",
      multiple: true,
    })
      .then((result) => {
        console.log("result", result);
        const asyncArr = result?.map((result) => {
          const file = {
            uri: result.path,
            name: result.filename || Date.now() + ".video",
            type: result.mime,
          };
          return AWSHelper.uploadFile(file);
        });
        Promise.all(asyncArr)
          .then((results) => {
            console.log("results", results);
            results.forEach((result) => {
              if (result?.data) {
                setVideos((newVideos) => [...newVideos, result.data]);
              }
            });
          })
          .catch((error) => {
            console.log("error", error);
          });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleSubmit = () => {
    console.log("videos", videos);
    if (!checkForm()) {
      return;
    }
    if (!pictures.length && !videos.length) {
      Toast.show(t("message.image_or_video"), {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
      return;
    }
    mutation.mutate({
      ...parameters,
      pictures: pictures.join(","),
      videos: videos.join(","),
      // 是否公开：1-是 2-否
      whetherPublic: parameters.whetherPublic ? 1 : 2,
    });
  };

  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        <View style={styles.container}>
          <Pressable
            onPress={() => {
              selectCategoryReference.current?.open();
            }}
          >
            <View style={styles.classification}>
              <Text style={styles.labelText}>
                {t("dynamic.classification")}：
              </Text>
              <View style={styles.classificationRight}>
                <Text style={{ ...styles.selectText, color: colors.gray800 }}>
                  {parameters.dynamicsPostCategory || t("common.select")}
                </Text>
                <Image
                  source={ArrowIcon as ImageURISource}
                  style={styles.arrowIcon}
                />
              </View>
            </View>
          </Pressable>

          <View style={styles.inputContainer}>
            <TextInput
              label=""
              maxLength={500}
              multiline
              onChangeText={(text) => {
                handleUpdateParameters(text, "content");
              }}
              placeholder={t("input.please-input")}
              style={[styles.textInput, backgrounds.gray1550]}
              underlineColor="transparent"
              value={parameters.content}
            />
            <View style={styles.inputNumberButtonContainer}>
              <Button mode="text" textColor={colors.gray800}>
                {parameters.content.length}/500
              </Button>
            </View>
          </View>

          <View style={styles.upload}>
            <Text style={styles.labelText}>
              {t("common.upload_pictures_videos")}
            </Text>
            <Text style={{ ...styles.uploadDescText, color: colors.gray800 }}>
              {t("common.first_cover_default")}
            </Text>
          </View>
          <View style={styles.segmentedControlContainer}>
            <SegmentedControl
              onChange={(event) => {
                setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
              }}
              selectedIndex={selectedIndex}
              sliderStyle={styles.segmentedControlSlider}
              style={styles.segmentedControl}
              values={[t("common.pictures"), t("common.videos")]}
            />
          </View>
          {selectedIndex === 0 ? (
            <View style={styles.uploadIconWrapper}>
              {pictures.map((item, index) => (
                <View key={item} style={styles.pictureItem}>
                  <Image source={{ uri: item }} style={styles.picture} />
                  <Pressable
                    onPress={() => {
                      setPictures((newPictures) =>
                        newPictures.filter((_, i) => i !== index)
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
              <Pressable onPress={handleUploadImage}>
                <Image
                  source={UploadIcon as ImageURISource}
                  style={styles.uploadIcon}
                />
              </Pressable>
            </View>
          ) : undefined}
          {selectedIndex === 1 ? (
            <View style={styles.uploadIconWrapper}>
              {videos.map((item, index) => (
                <View key={item} style={styles.pictureItem}>
                  <VideoPlayer
                    paused
                    disableFullscreen
                    disablePlayPause
                    disableVolume
                    disableTimer
                    disableBack
                    disableSeekbar
                    useAnimations={useAnimations}
                    source={{ uri: item }}
                    containerStyle={styles.picture}
                  />
                  <Pressable
                    onPress={() => {
                      setVideos((newVideos) =>
                        newVideos.filter((_, i) => i !== index)
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
              <Pressable onPress={handleUploadVideo}>
                <Image
                  source={UploadIcon as ImageURISource}
                  style={styles.uploadIcon}
                />
              </Pressable>
            </View>
          ) : undefined}

          <View style={[styles.released, backgrounds.gray1550]}>
            <Text style={styles.labelText}>
              {t("common.is_publicly_released")}
            </Text>
            <Switch
              onValueChange={(vlaue) => {
                handleUpdateParameters(vlaue, "whetherPublic");
              }}
              value={parameters.whetherPublic}
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
              {t("common.release")}
            </Button>
          </View>
        </View>
      </SafeScreen>
      <SelectCategory
        ref={selectCategoryReference}
        onChange={handleSelectCategory}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    height: 15,
    width: 11,
  },
  buttonContainer: {
    marginTop: 49,
  },
  classification: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  classificationRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  container: {
    paddingVertical: 15,
  },
  inputContainer: {
    marginTop: 32,
  },
  inputNumberButtonContainer: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
  labelText: {
    fontSize: 15,
    fontWeight: 500,
  },
  picture: {
    borderRadius: 10,
    height: 105,
    width: 105,
  },
  pictureItem: {
    height: 105,
    position: "relative",
    width: 105,
  },
  released: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
  removeIcon: {
    height: 22,
    width: 22,
  },
  removeIconWrapper: {
    height: 22,
    position: "absolute",
    right: 0,
    top: 0,
    width: 22,
  },
  safeScreen: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  segmentedControl: {
    borderRadius: 38,
    height: 38,
    width: 221,
  },
  segmentedControlContainer: {
    marginTop: 12,
  },
  segmentedControlSlider: {
    borderRadius: 30,
    height: 30,
    top: 4,
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
    minHeight: 180,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
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
    height: 105,
    width: 105,
  },
  uploadIconWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 16,
  },
});
