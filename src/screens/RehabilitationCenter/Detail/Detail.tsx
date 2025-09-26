import { LegendList } from "@legendapp/list";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ImageURISource,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { showLocation } from "react-native-map-link";
import { Pressable } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import Toast from "react-native-root-toast";
import { WebView } from "react-native-webview";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";
import { ImageWithFallback } from "@/components/atoms";
import { normalizeImageUrl } from "@/utils/image";
import Empty from "@/components/common/Empty/Empty.tsx";
import CommentItem from "@/screens/RehabilitationCenter/components/CommentItem/CommentItem.tsx";
import DoctorItem from "@/screens/RehabilitationCenter/components/DoctorItem/DoctorItem.tsx";

import LocationIcon from "@/assets/images/142.png";
import BackIcon from "@/assets/images/222.png";
import CollectIcon from "@/assets/images/223.png";
import CollectFIcon from "@/assets/images/225.png";
import FilterIcon from "@/assets/images/604.png";
import { centerDetail, commentList, doctorList, favorite } from "@/services";
import { Rating } from "@kolking/react-native-rating";
import { useLocationStore } from "@/store";
import { Configs } from "@/common/configs.ts";
import { useFocusEffect } from "@react-navigation/native";
import GalleryPreview from "react-native-gallery-preview";

const IMAGE_SOURCE_KEYS: readonly string[] = [
  "backgroundImages",
  "images",
  "imageList",
  "gallery",
  "pictures",
  "photo",
  "photos",
  "album",
  "image",
  "coverImage",
  "cover",
  "banner",
];

const IMAGE_NESTED_KEYS: readonly string[] = [
  "url",
  "uri",
  "image",
  "imageUrl",
  "value",
  "src",
  "path",
];

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const extractStrings = (value: unknown): string[] => {
  if (!value) {
    return [];
  }

  if (isNonEmptyString(value)) {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => extractStrings(entry));
  }

  if (typeof value === "object") {
    const record = asRecord(value);
    return IMAGE_NESTED_KEYS.flatMap((key) => extractStrings(record[key]));
  }

  return [];
};

const imageFromHtml = (html?: string): string | undefined => {
  if (!html) {
    return undefined;
  }
  const match = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  return match?.[1];
};

const extractImageUris = (
  source: Record<string, unknown>,
  html?: string,
): string[] => {
  const uris = new Set<string>();

  IMAGE_SOURCE_KEYS.forEach((key) => {
    extractStrings(source[key]).forEach((uri) => {
      if (isNonEmptyString(uri)) {
        uris.add(uri);
      }
    });
  });

  if (uris.size === 0) {
    const htmlImage = imageFromHtml(html);
    if (htmlImage) {
      uris.add(htmlImage);
    }
  }

  return Array.from(uris);
};

const listHtml = (title: string, items: unknown): string => {
  const values = Array.isArray(items) ? items : undefined;
  if (!values || values.length === 0) {
    return "";
  }

  const sanitizedItems = values
    .map((item) => (isNonEmptyString(item) ? escapeHtml(item) : undefined))
    .filter(Boolean) as string[];

  if (sanitizedItems.length === 0) {
    return "";
  }

  return `
    <section>
      <h3>${escapeHtml(title)}</h3>
      <ul>
        ${sanitizedItems.map((entry) => `<li>${entry}</li>`).join("")}
      </ul>
    </section>
  `;
};

const hoursHtml = (hours: unknown): string => {
  const entries = Object.entries(asRecord(hours));
  if (entries.length === 0) {
    return "";
  }

  return `
    <section>
      <h3>Hours</h3>
      <ul>
        ${entries
          .map(([day, schedule]) => {
            if (!isNonEmptyString(schedule)) {
              return "";
            }
            return `<li><strong>${escapeHtml(day)}</strong>: ${escapeHtml(schedule)}</li>`;
          })
          .join("")}
      </ul>
    </section>
  `;
};
export default function RehabilitationCenterDetail({
  navigation,
  route,
}: RootScreenProps<Paths.RehabilitationCenterDetail>) {
  const { backgrounds, colors } = useTheme();
  const { payload, ...paramsWithoutPayload } = route.params;
  const { id } = paramsWithoutPayload;
  const progress = useSharedValue<number>(0);
  const [post, setPost] = useState<Record<string, unknown>>(() => ({
    ...asRecord(payload),
    ...asRecord(paramsWithoutPayload),
  }));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(100);
  const [isVisible, setIsVisible] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const location = useLocationStore((state) => state.location);

  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      queryClient.refetchQueries({
        queryKey: [Paths.RehabilitationCenterDetail],
        type: "active",
      });
      return () => {};
    }, [queryClient])
  );

  const mutation = useMutation({
    mutationFn: favorite,
    onError: (error) => {
      console.log("error", error);
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        const currentlyFavorited = Boolean(asRecord(post).isFavorited);

        setPost((current) => ({
          ...asRecord(current),
          isFavorited: !currentlyFavorited,
        }));

        Toast.show(
          currentlyFavorited
            ? "Removed from favorites"
            : "Added to favorites",
          {
            animation: true,
            delay: 0,
            duration: 1000,
            hideOnPress: true,
            position: Toast.positions.CENTER,
            shadow: true,
          }
        );
      }
    },
  });

  const handleToggleCollect = useCallback(() => {
    if (!centerId) {
      return;
    }
    mutation.mutate({
      objectId: centerId,
      // 收藏对象类型：1-康复中心 2-科普 3-动态
      objectType: 1,
    });
  }, [centerId, mutation]);

  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerBtnGroup}>
            <TouchableOpacity
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={BackIcon as ImageURISource}
                style={styles.headerBtnIcon}
              />
            </TouchableOpacity>
          </View>
        );
      },
      headerRight: () => {
        if (!centerId) {
          return undefined;
        }
        const isFavorited = Boolean(asRecord(post).isFavorited);
        return (
          <View style={styles.headerBtnGroup}>
            <Pressable onPress={handleToggleCollect}>
              {isFavorited ? (
                <Image
                  source={CollectFIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                />
              ) : (
                <Image
                  source={CollectIcon as ImageURISource}
                  style={styles.headerBtnIcon}
                />
              )}
            </Pressable>
          </View>
        );
      },
    });
  }, [centerId, handleToggleCollect, navigation, post]);

  const { data: postData, isSuccess: postDataIsSuccess } = useQuery({
    queryFn: () => {
      return centerDetail({
        ...(location?.coords || {}),
        id,
      });
    },
    queryKey: [Paths.RehabilitationCenterDetail, "centerDetail", id],
  });

  useEffect(() => {
    if (postDataIsSuccess) {
      setPost((current) => ({
        ...current,
        ...asRecord(postData?.data),
      }));
    }
  }, [setPost, postData, postDataIsSuccess]);

  const mergedSource = useMemo(
    () => ({
      ...asRecord(paramsWithoutPayload),
      ...post,
    }),
    [paramsWithoutPayload, post],
  );

  const centerId = useMemo(() => {
    const candidate = mergedSource.id ?? id;
    if (candidate === null || candidate === undefined) {
      return "";
    }
    return String(candidate);
  }, [mergedSource, id]);

  const detailHtml = useMemo(() => {
    const sections: string[] = [];

    const detailCandidates = [
      mergedSource.detail,
      mergedSource.details,
      mergedSource.html,
    ];

    for (const candidate of detailCandidates) {
      if (isNonEmptyString(candidate)) {
        sections.push(candidate);
        break;
      }
    }

    const textKeys = [
      "description",
      "summary",
      "intro",
      "introduction",
      "overview",
      "about",
    ];

    for (const key of textKeys) {
      if (sections.length > 0) {
        break;
      }
      const value = mergedSource[key];
      if (isNonEmptyString(value)) {
        sections.push(`<p>${escapeHtml(value)}</p>`);
      }
    }

    sections.push(
      listHtml("Services", mergedSource.services),
      listHtml("Facilities", mergedSource.facilities),
      listHtml("Specialties", mergedSource.specialties),
      listHtml("Accessibility", mergedSource.accessibleHighlights),
      listHtml("Insurance", mergedSource.insurance),
      hoursHtml(mergedSource.hours),
    );

    const filtered = sections.filter((section) =>
      isNonEmptyString(section?.toString?.())
    ) as string[];

    if (filtered.length === 0) {
      return "<p>Further information will be available soon.</p>";
    }

    return filtered.join("\n");
  }, [mergedSource]);

  const imageCandidates = useMemo(
    () => extractImageUris(mergedSource, detailHtml),
    [mergedSource, detailHtml],
  );

  const normalizedImageUris = useMemo(() => {
    return imageCandidates
      .map((uri) => normalizeImageUrl(uri))
      .filter((uri): uri is string => Boolean(uri));
  }, [imageCandidates]);

  const previewImages = useMemo(
    () =>
      normalizedImageUris.map((uri) => ({
        uri,
        type: "image" as const,
      })),
    [normalizedImageUris],
  );

  const hasPreviewImages = normalizedImageUris.length > 0;

  const ratingRaw = useMemo(() => {
    const candidates = [
      mergedSource.star,
      mergedSource.rating,
      mergedSource.score,
      mergedSource.averageRating,
    ];

    for (const candidate of candidates) {
      if (candidate === 0 || candidate === "0") {
        return candidate;
      }
      if (typeof candidate === "number" && Number.isFinite(candidate)) {
        return candidate;
      }
      if (isNonEmptyString(candidate)) {
        return candidate;
      }
    }

    return undefined;
  }, [mergedSource]);

  const ratingValue = useMemo(() => {
    if (typeof ratingRaw === "number") {
      return ratingRaw;
    }
    if (isNonEmptyString(ratingRaw)) {
      const parsed = Number.parseFloat(ratingRaw);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }, [ratingRaw]);

  const ratingDisplay = isNonEmptyString(ratingRaw)
    ? ratingRaw
    : ratingValue !== undefined
    ? ratingValue.toFixed(1)
    : undefined;

  const reviewCount = useMemo(() => {
    const candidates = [
      mergedSource.commentNum,
      mergedSource.reviewsCount,
      mergedSource.reviewCount,
      mergedSource.comments,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "number" && Number.isFinite(candidate)) {
        return candidate;
      }
      if (isNonEmptyString(candidate)) {
        const parsed = Number.parseInt(candidate, 10);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }
    return undefined;
  }, [mergedSource]);

  const displayName = isNonEmptyString(mergedSource.name)
    ? mergedSource.name
    : "Rehabilitation Center";

  const displayAddress = isNonEmptyString(mergedSource.address)
    ? mergedSource.address
    : undefined;

  const distanceLabel = useMemo(() => {
    const candidates = [
      mergedSource.distance,
      mergedSource.distanceKm,
      mergedSource.distanceMiles,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "number" && Number.isFinite(candidate)) {
        return candidate.toFixed(1);
      }
      if (isNonEmptyString(candidate)) {
        return candidate;
      }
    }
    return undefined;
  }, [mergedSource]);

  const primaryImage = normalizedImageUris[0];

  const { data, hasNextPage } = useInfiniteQuery({
    enabled: selectedIndex !== 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (__DEV__) console.log(lastPage, allPages);
      if (!lastPage?.rows || lastPage.rows?.length < 10) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    initialPageParam: 1,
    queryFn: async (pageParam) => {
      if (selectedIndex === 1) {
        return doctorList({
          page: pageParam.pageParam,
          rehabilitationCenterId: centerId,
        });
      }

      if (selectedIndex === 2) {
        return commentList({
          page: pageParam.pageParam,
          // 评论对象：1-动态帖子 2-科普 3-康复中心 4-医师
          objectId: centerId,
          objectType: 3,
        });
      }
    },
    queryKey: [
      Paths.RehabilitationCenterDetail,
      "doctorList",
      "commentList",
      post,
      selectedIndex,
    ],
  });

  const renderDescription = useCallback(() => {
    return (
      <WebView
        automaticallyAdjustContentInsets
        injectedJavaScript={`
        document.body.style.overflow = 'hidden';
          document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
              event.preventDefault();
              window.ReactNativeWebView.postMessage(link.href);
            });
          });
          setTimeout(function() { 
                        window.ReactNativeWebView.postMessage(String(document.body.scrollHeight|| ''));
          }, 100); // a slight delay seems to yield a more accurate value
           true;
        `}
        onError={(e) => {
          console.log(e);
        }}
        onLoadProgress={() => {
          console.log("loading…");
        }}
        onMessage={(event) => {
          const payload = event?.nativeEvent?.data;
          if (!payload) {
            return;
          }

          const parsedHeight = Number.parseInt(payload, 10);

          if (Number.isNaN(parsedHeight)) {
            // Non-numeric payloads are link clicks; treat them as external URLs.
            const maybeUrl = payload.trim();
            if (maybeUrl.startsWith("http")) {
              Linking.openURL(maybeUrl).catch((error) =>
                console.warn("Failed to open link from webview payload", error)
              );
            }
            return;
          }

          setSectionHeight(parsedHeight);
        }}
        originWhitelist={["*"]}
        overScrollMode="never"
        scalesPageToFit={Platform.OS === "ios"}
        scrollEnabled={false}
        source={{
          html:
            Configs.HtmlHead + `<body><div>${detailHtml}</div></body>`,
        }}
        style={[
          {
            height: sectionHeight,
          },
        ]}
      />
    );
  }, [detailHtml, sectionHeight]);

  useEffect(() => {
    setSectionHeight(100);
  }, [detailHtml]);

  let dataList: any[] = [];
  if (data?.pages) {
    dataList = (data.pages as any[]).flatMap((page, pageIndex) =>
      ((page as any)?.rows ?? []).map((row: any, rowIndex: number) => ({
        ...row,
        __legendKey: `${row?.id ?? "rehab-comment"}-${pageIndex}-${rowIndex}`,
      }))
    );
  }

  const handlePreview = useCallback(
    (uri?: string) => {
      if (!uri) {
        return;
      }
      const index = normalizedImageUris.findIndex((candidate) => candidate === uri);
      if (index < 0) {
        return;
      }
      setInitialIndex(index);
      setIsVisible(true);
    },
    [normalizedImageUris],
  );

  const coordinates = useMemo(() => {
    const latitudeCandidate = mergedSource.latitude ?? mergedSource.lat;
    const longitudeCandidate =
      mergedSource.longitude ?? mergedSource.lng ?? mergedSource.lon;

    const latitude = Number.parseFloat(String(latitudeCandidate ?? ""));
    const longitude = Number.parseFloat(String(longitudeCandidate ?? ""));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return undefined;
    }

    return { latitude, longitude };
  }, [mergedSource]);

  const handleShowLocation = () => {
    if (!coordinates) {
      return;
    }

    showLocation({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      title: displayAddress ?? displayName,
      appsWhiteList: ["google-maps", "apple-maps"],
    });
  };

  const distanceDisplay = useMemo(() => {
    if (!distanceLabel) {
      return undefined;
    }
    return /[a-zA-Z]/.test(distanceLabel) ? distanceLabel : `${distanceLabel}km`;
  }, [distanceLabel]);

  const ratingValueSanitized = useMemo(() => {
    if (ratingValue === undefined) {
      return 0;
    }
    return Math.min(Math.max(ratingValue, 0), 5);
  }, [ratingValue]);

  const RenderListHeader = useCallback(() => {
    const hasCarouselImages = normalizedImageUris.length > 0;
    const carouselData = hasCarouselImages
      ? normalizedImageUris
      : [undefined];

    return (
      <View>
        {hasCarouselImages ? (
          <Carousel
            data={carouselData}
            enabled={normalizedImageUris.length > 1}
            height={211}
            loop={normalizedImageUris.length > 1}
            onProgressChange={progress}
            renderItem={({ item }) => (
              <Pressable
                disabled={!hasPreviewImages}
                onPress={() => {
                  if (hasPreviewImages) {
                    handlePreview(item);
                  }
                }}
              >
                <ImageWithFallback
                  uri={item}
                  style={styles.carouselImg}
                />
              </Pressable>
            )}
            width={Dimensions.get("window").width}
          />
        ) : (
          <ImageWithFallback style={styles.carouselImg} />
        )}
        <View style={[styles.info, backgrounds.gray1600]}>
          <Text style={styles.titleText}>{displayName}</Text>

          <View style={styles.locationWrapper}>
            <View style={styles.locationLeft}>
              {displayAddress ? (
                <Text style={styles.locationText}>{displayAddress}</Text>
              ) : null}
              {distanceDisplay ? (
                <Text style={{ ...styles.distanceText, color: colors.gray800 }}>
                  {distanceDisplay}
                </Text>
              ) : null}
            </View>
            <Pressable
              disabled={!coordinates}
              onPress={handleShowLocation}
              style={({ pressed }) => [
                styles.locationButton,
                !coordinates && styles.locationButtonDisabled,
                pressed && styles.locationButtonPressed,
              ]}
            >
              <Image
                source={LocationIcon as ImageURISource}
                style={styles.locationIcon}
              />
            </Pressable>
          </View>

          <View style={styles.scoreWrapper}>
            <Text style={styles.scoreText}>{ratingDisplay ?? "—"}</Text>
            <Rating
              disabled
              size={12}
              rating={ratingValueSanitized}
              fillColor="#333"
              touchColor="#000"
            />
            <Text style={{ ...styles.commentNumberText, color: colors.gray800 }}>
              ({reviewCount ?? 0})
            </Text>
          </View>
        </View>
        <View style={[{ height: 8 }, backgrounds.gray1550]} />
      </View>
    );
  }, [
    backgrounds.gray1550,
    backgrounds.gray1600,
    colors.gray800,
    coordinates,
    displayAddress,
    displayName,
    distanceDisplay,
    handlePreview,
    handleShowLocation,
    hasPreviewImages,
    normalizedImageUris,
    progress,
    ratingDisplay,
    ratingValueSanitized,
    reviewCount,
  ]);

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
          values={["Description", "Medical team", "Evaluation"]}
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
              {ratingDisplay ?? "—"}
            </Text>
          </View>
          <View>
            <Text>{"Very good"}</Text>
            <Text>
              {reviewCount ?? 0}
              {" Reviews count"}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => {
            navigation.navigate(Paths.RehabilitationCenterEvaluate, {
              id: String(mergedSource.id ?? id ?? ""),
              name: displayName,
              coverImage:
                primaryImage ??
                (isNonEmptyString(mergedSource.coverImage)
                  ? (mergedSource.coverImage as string)
                  : undefined),
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

  const renderDoctorItem = ({ index, item }) => {
    return (
      <View key={item.id}>
        <DoctorItem item={item} />
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

  console.log(hasNextPage, data);

  return (
    <>
      <SafeScreen
        edges={["bottom"]}
        style={[styles.safeScreen, backgrounds.gray1600]}
      >
        {selectedIndex === 0 ? (
          <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
            <RenderListHeader />
            {renderSegmentedControl()}
            {renderDescription()}
          </ScrollView>
        ) : undefined}
        {selectedIndex === 1 ? (
          <LegendList
            contentContainerStyle={styles.container}
            data={dataList}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                <RenderListHeader />
                {renderSegmentedControl()}
              </>
            }
            onEndReached={fetchNextPage}
            renderItem={renderDoctorItem}
          />
        ) : undefined}
        {selectedIndex === 2 ? (
          <>
            <LegendList
              contentContainerStyle={styles.container}
              data={dataList}
              keyExtractor={(item, index) =>
                item?.__legendKey ?? `${item?.id ?? index}`
              }
              onEndReached={() => fetchNextPage()}
              ListEmptyComponent={<Empty />}
              renderItem={({ index, item }) => (
                <CommentItem
                  item={item || {}}
                  key={item.__legendKey ?? item.id ?? index}
                  onReply={handleOnReply}
                />
              )}
            />
          </>
        ) : undefined}
      </SafeScreen>
      <GalleryPreview
        isVisible={isVisible}
        initialIndex={initialIndex}
        onRequestClose={() => setIsVisible(false)}
        images={previewImages}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
  carouselImg: {
    height: 211,
    width: "100%",
  },
  commentIcon: {
    height: 18,
    width: 18,
  },
  commentNumberText: {
    fontSize: 12,
    marginLeft: 4,
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
    marginTop: -15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  locationIcon: {
    height: 28,
    width: 28,
  },
  locationButton: {
    alignItems: "center",
    borderRadius: 18,
    justifyContent: "center",
    padding: 6,
  },
  locationButtonDisabled: {
    opacity: 0.5,
  },
  locationButtonPressed: {
    opacity: 0.7,
  },
  locationText: {
    fontSize: 13,
    fontWeight: 500,
  },
  locationLeft: {
    flex: 1,
  },
  locationWrapper: {
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 20,
  },
  safeScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scoreIcon: {
    height: 16,
    width: 16,
  },
  scoreText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: 500,
  },
  scoreWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginTop: 14,
  },
  segmentedControl: {
    borderRadius: 18,
    height: 40,
    width: 298,
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
  titleText: {
    fontSize: 18,
    fontWeight: 600,
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
});
