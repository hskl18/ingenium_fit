import { LegendList } from "@legendapp/list";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks";
import {
  Dimensions,
  Image,
  ImageURISource,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ImageWithFallback } from "@/components/atoms";
import { Pressable } from "react-native-gesture-handler";
import { Avatar, Text } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";
import CommentItem from "@/screens/RehabilitationCenter/components/CommentItem/CommentItem.tsx";

import ProfessionalIcon from "@/assets/images/153.png";
import PracticeScopeIcon from "@/assets/images/154.png";
import EducationalBackgroundIcon from "@/assets/images/155.png";
import WorkExperienceIcon from "@/assets/images/156.png";
import BackIcon from "@/assets/images/222.png";
import ScoreIcon from "@/assets/images/244.png";
import FilterIcon from "@/assets/images/604.png";
import { commentList, doctorDetail } from "@/services";
import { useFocusEffect } from "@react-navigation/native";
import GalleryPreview from "react-native-gallery-preview";

export function RehabilitationCenterDoctor({
  navigation,
  route,
}: RootScreenProps<Paths.RehabilitationCenterDoctor>) {
  const { backgrounds, colors } = useTheme();
  const { id } = route.params;
  const progress = useSharedValue<number>(0);
  const [post, setPost] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.RehabilitationCenterDoctor],
        type: "active",
      });
      return () => {};
    }, [])
  );

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerBtnGroup}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={BackIcon as ImageURISource}
                style={styles.headerBtnIcon}
              />
            </Pressable>
          </View>
        );
      },
    });
  }, [navigation]);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => {
      return doctorDetail({ id });
    },
    queryKey: [Paths.RehabilitationCenterDoctor, "doctorDetail", id],
  });

  useEffect(() => {
    if (postDataIsSuccess) {
      setPost(postData.data || {});
    }
  }, [setPost, postData, postDataIsSuccess]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isSuccess,
  } = useInfiniteQuery({
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (__DEV__) console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    queryFn: async (pageParam) => {
      return commentList({
        page: pageParam.pageParam,
        // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
        objectId: id,
        objectType: 4,
      });
    },
    queryKey: [Paths.RehabilitationCenterDoctor, "commentList", post],
  });

  const educationalBackgroundList = post.doctorEducationalBackgroundList || [];
  const workExperienceList = post.doctorWorkExperienceList || [];
  const renderDescription = useCallback(() => {
    return (
      <View style={styles.resumeWrapper}>
        <View style={styles.titleWrapper}>
          <Image
            source={ProfessionalIcon as ImageURISource}
            style={styles.titleIcon}
          />
          <Text style={styles.titleText}>
            {"Job title"}：{post.positionTitle}
          </Text>
        </View>
        <View style={styles.titleWrapper}>
          <Image
            source={PracticeScopeIcon as ImageURISource}
            style={styles.titleIcon}
          />
          <Text style={styles.titleText}>
            {"Practice scope"}：{post.positionRange}
          </Text>
        </View>
        {educationalBackgroundList.length > 0 ? (
          <View style={styles.educationalBackgroundWrapper}>
            <View style={styles.titleWrapper}>
              <Image
                source={EducationalBackgroundIcon as ImageURISource}
                style={styles.titleIcon}
              />
              <Text style={styles.titleText}>{"Education background"}</Text>
            </View>
            {educationalBackgroundList.map((item, index) => (
              <View key={item.id} style={styles.educationalBackground}>
                <Text style={styles.educationalText}>
                  {item.startTime}-{item.endTime}
                </Text>
                <Text
                  style={[
                    styles.educationalText,
                    {
                      marginTop: 6,
                    },
                  ]}
                >
                  {item.qualification}
                </Text>
              </View>
            ))}
          </View>
        ) : undefined}
        {workExperienceList.length > 0 ? (
          <View style={styles.workExperienceWrapper}>
            <View style={styles.titleWrapper}>
              <Image
                source={WorkExperienceIcon as ImageURISource}
                style={styles.titleIcon}
              />
              <Text style={styles.titleText}>{"Work experience"}</Text>
            </View>
            {workExperienceList.map((item, index) => (
              <View key={item.id} style={styles.workExperience}>
                <Text
                  style={{
                    ...styles.workExperienceDateText,
                    color: colors.gray800,
                  }}
                >
                  {item.startTime}-{item.endTime}
                </Text>
                <Text style={styles.workExperienceText}>{item.position}</Text>
                <Text
                  style={[
                    styles.workExperienceText,
                    {
                      marginTop: 12,
                    },
                  ]}
                >
                  {item.content}
                </Text>
              </View>
            ))}
          </View>
        ) : undefined}
      </View>
    );
  }, [post]);

  let dataList = [];
  if (data?.pages && data?.pages.length) {
    dataList = data?.pages.flatMap((item) => item?.rows);
  }

  const renderSegmentedControl = () => {
    return (
      <View style={styles.segmentedControlContainer}>
        <SegmentedControl
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          selectedIndex={selectedIndex}
          sliderStyle={styles.segmentedControlSlider}
          style={styles.segmentedControl}
          values={["Physician resume", "Evaluation"]}
        />
      </View>
    );
  };
  const renderCommentTitle = () => {
    return (
      <View style={styles.evaluationTitleWrapper}>
        <View style={styles.evaluationTitleLeft}>
          <View style={styles.commentStar}>
            <Text style={{ ...styles.commentStarText, color: colors.gray1600 }}>
              {post.star}
            </Text>
          </View>
          <View>
            <Text>{"Very good"}</Text>
            <Text>
              {post.commentNum || 0}
              {"Reviews count"}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate(Paths.RehabilitationCenterDoctorEvaluate, {
              id: post.id,
              name: post.name,
              headImage: post.headImage,
            });
          }}
          style={[
            styles.button,
            {
              borderColor: colors.primary,
            },
          ]}
        >
          <Image
            source={FilterIcon as ImageURISource}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonLabel}>{"Write evaluation"}</Text>
        </Pressable>
      </View>
    );
  };
  const renderCommentItem = ({ index, item }) => {
    return (
      <View key={item.id}>
        <CommentItem item={item} />
      </View>
    );
  };
  const images = useMemo(() => {
    let pictures = [];
    if (post.backgroundImages) {
      pictures = post.backgroundImages?.split(",").map((img) => ({
        uri: img,
        type: "image",
      }));
    }
    return pictures;
  }, [post]);
  const handlePreview = (item) => {
    setIsVisible(true);
    setInitialIndex(images.findIndex((img) => img.uri === item));
  };

  const RenderListHeader = useMemo(() => {
    const postImages = post.backgroundImages
      ? post.backgroundImages?.split(",")
      : [];

    const tags = post.tags ? post.tags?.split(",") : [];

    return (
      <View>
        <Carousel
          data={postImages}
          height={211}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                handlePreview(item);
              }}
            >
              <ImageWithFallback uri={item} style={styles.carouselImg} />
            </Pressable>
          )}
          width={Dimensions.get("window").width}
        />
        <View style={[styles.info, backgrounds.gray1600]}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarInner}>
              <Avatar.Image
                size={104}
                style={styles.avatar}
                source={{
                  uri: post.headImage,
                }}
              ></Avatar.Image>
            </View>
          </View>
          <Text style={styles.nameText}>{post.name}</Text>
          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{post.star}</Text>
            <Image
              source={ScoreIcon as ImageURISource}
              style={styles.scoreIcon}
            />
            <Text style={[styles.commentNumText, { color: colors.gray800 }]}>
              ({post.commentNum || 0})
            </Text>
          </View>

          <View style={styles.tagWrapper}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={{ ...styles.tagText, color: colors.primary }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }, [post, progress, backgrounds, colors]);

  console.log(hasNextPage, data);

  return (
    <>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        {selectedIndex === 0 ? (
          <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
            {RenderListHeader}
            {renderSegmentedControl()}
            {renderDescription()}
          </ScrollView>
        ) : undefined}
        {selectedIndex === 1 ? (
          <LegendList
            contentContainerStyle={styles.container}
            data={dataList}
            keyExtractor={(item) => item.id}
            onEndReached={() => fetchNextPage()}
            ListHeaderComponent={
              <>
                {RenderListHeader}
                {renderSegmentedControl()}
                {renderCommentTitle()}
              </>
            }
            renderItem={renderCommentItem}
          />
        ) : undefined}
      </SafeScreen>
      <GalleryPreview
        isVisible={isVisible}
        initialIndex={initialIndex}
        onRequestClose={() => setIsVisible(false)}
        images={images}
      />
    </>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    flexDirection: "row",
    marginTop: -64,
  },
  avatarInner: {
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: "50%",
  },
  avatar: {},
  button: {
    alignItems: "center",
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    height: 30,
    paddingHorizontal: 11,
  },
  buttonIcon: {
    height: 14,
    width: 14,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  scrollView: {
    flex: 1,
  },
  carouselImg: {
    height: 211,
    width: "100%",
  },
  commentIcon: {
    height: 18,
    width: 18,
  },
  commentTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {},
  content: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  contentText: {
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 14,
  },
  distanceText: {
    fontSize: 13,
    fontWeight: 500,
    marginTop: 3,
  },
  commentStarText: {
    fontSize: 16,
    fontWeight: 500,
  },
  commentStar: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E77626",
  },
  evaluationTitleLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  evaluationTitleWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  headerBtnGroup: {
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  headerBtnIcon: {
    height: 34,
    width: 34,
  },
  info: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: -47,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  locationIcon: {
    height: 28,
    marginBottom: 6,
    width: 28,
  },
  locationText: {
    fontSize: 13,
    fontWeight: 500,
  },
  locationWrapper: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  safeScreen: {},
  scoreIcon: {
    height: 16,
    width: 16,
  },
  scoreText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: 500,
  },
  commentNumText: {
    fontSize: 12,
  },
  educationalText: {
    flexShrink: 1,
    fontSize: 14,
  },
  workExperienceDateText: {
    marginBottom: 6,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: 500,
  },
  workExperienceText: {
    flexShrink: 1,
    fontSize: 14,
  },
  scoreWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  educationalBackground: {
    marginTop: 10,
    paddingLeft: 26,
  },
  workExperience: {
    marginTop: 10,
    paddingLeft: 26,
  },
  educationalBackgroundWrapper: {
    marginTop: 22,
  },
  workExperienceWrapper: {
    marginTop: 30,
  },
  segmentedControl: {
    borderRadius: 18,
    height: 40,
    width: 264,
  },
  segmentedControlContainer: {
    alignItems: "center",
    marginBottom: 8,
    marginTop: 20,
  },
  segmentedControlSlider: {
    borderRadius: 18,
    height: 32,
    top: 4,
  },
  titleContainer: {
    marginBottom: 15,
  },
  resumeWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 600,
  },
  titleIcon: {
    height: 16,
    width: 16,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 500,
  },
  toolWrapper: {
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    marginTop: 28,
  },
  userWrapper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  tag: {
    alignItems: "center",
    backgroundColor: "rgba(0, 119, 210, 0.1)",
    borderRadius: 4,
    height: 19,
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  tagText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: 500,
  },
  tagWrapper: {
    marginTop: 8,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
});
