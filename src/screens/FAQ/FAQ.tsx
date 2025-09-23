import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks";
import {
  Image,
  ImageURISource,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { Button, List, Searchbar, Text } from "react-native-paper";
import Animated from "react-native-reanimated";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";

import TitleIcon from "@/assets/images/205.png";
import { faqsList } from "@/services";
import Empty from "@/components/common/Empty/Empty.tsx";
import { useFocusEffect } from "@react-navigation/native";

export default function FAQ({ navigation }: RootScreenProps<Paths.FAQ>) {
  const { backgrounds } = useTheme();
  const [activeSections, setActiveSections] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const queryClient = useQueryClient();

  const {
    data,
    error,
    isError,
    isFetching,
    isPending,
    isPlaceholderData,
    isSuccess,
    refetch,
  } = useQuery({
    queryFn: () => {
      return faqsList({
        searchKey,
      });
    },
    queryKey: [Paths.FAQ, "faqsList"],
  });

  const handleSearch = () => {
    queryClient.invalidateQueries({
      queryKey: [Paths.FAQ],
    });
  };

  const renderHeader = (section) => {
    return (
      <Animated.View style={[styles.titleWrapper]}>
        <Image source={TitleIcon as ImageURISource} style={styles.icon} />
        <Text style={styles.title}>{section.title}</Text>
      </Animated.View>
    );
  };
  const renderContent = (section) => {
    let pictures = [];
    if (section?.images) {
      pictures = section.images.split(",");
    }
    return (
      <Animated.View
        transition="backgroundColor"
        style={[styles.contentWrapper]}
      >
        <Text>{section.content}</Text>
        <View style={styles.pictureWrapper}>
          {pictures.map((item, index) => (
            <View key={item} style={styles.pictureItem}>
              <Image source={{ uri: item }} style={styles.picture} />
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  if (!isSuccess) {
    return;
  }
  return (
    <ScrollView style={[styles.scrollView, backgrounds.gray1550]}>
      <SafeScreen edges={["bottom"]} style={[backgrounds.gray1550]}>
        <View style={styles.searchWrapper}>
          <Searchbar
            onChangeText={setSearchKey}
            placeholder={"Keyword search"}
            right={() => {
              return (
                <View style={{ paddingHorizontal: 10 }}>
                  <Button mode="contained" onPress={handleSearch}>
                    {"Search"}
                  </Button>
                </View>
              );
            }}
            style={[backgrounds.gray1600]}
            value={searchKey}
          />
        </View>
        {data.data?.length > 0 ? (
          <Accordion
            containerStyle={[styles.container, backgrounds.gray1600]}
            sections={data?.data}
            activeSections={activeSections}
            renderHeader={renderHeader}
            underlayColor="rgba(0, 0, 0,0.06)"
            renderContent={renderContent}
            onChange={setActiveSections}
          />
        ) : (
          <Empty />
        )}
      </SafeScreen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 16,
    fontWeight: 600,
  },
  contentWrapper: {
    paddingBottom: 10,
  },
  icon: {
    height: 16,
    width: 16,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
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
  pictureWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  titleWrapper: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
  },
});
