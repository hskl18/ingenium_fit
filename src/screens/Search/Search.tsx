import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "@/hooks";
import {
  Image,
  ImageURISource,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Divider, Text, TextInput } from "react-native-paper";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";

import { SafeScreen } from "@/components/templates";
import InstitutionList from "@/screens/Search/components/InstitutionList/InstitutionList.tsx";
import SciencePopularizationList from "@/screens/Search/components/SciencePopularizationList/SciencePopularizationList.tsx";
import UpdatesList from "@/screens/Search/components/UpdatesList/UpdatesList.tsx";

import { storage } from "@/storage";
import SearchIcon from "@/assets/images/73.png";
import ArrowIcon from "@/assets/images/74.png";
import ArrowRightIcon from "@/assets/images/75.png";
import { Configs } from "@/common/configs.ts";
import { termsList } from "@/services";
import { useSearchStore } from "@/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchContext } from "./SearchContext";

const Tab = createMaterialTopTabNavigator();

export default function Search({
  navigation,
  route,
}: RootScreenProps<Paths.Search>) {
  const { backgrounds, colors, navigationTheme, variant } = useTheme();
  const { t } = useTranslation();
  const [isSearch, setIsSearch] = useState(false);
  const [keywordList, setKeywordList] = useState([]);
  const inputRef = useRef(null);
  const [searchKey, setSearchKey] = useState(route.params?.searchKey || "");
  const [historyList, setHistoryList] = useSearchStore(
    useShallow((state) => [state.historyList, state.setHistoryList])
  );
  const insets = useSafeAreaInsets();

  const { data, isSuccess } = useQuery({
    queryFn: termsList,
    queryKey: [Paths.Search, "termsList"],
  });

  useEffect(() => {
    if (route.params?.searchKey) {
      setIsSearch(true);
      handleSetHistoryList({
        searchTerms: route.params?.searchKey,
      });
    }
  }, [route.params?.searchKey]);

  useEffect(() => {
    if (!searchKey) {
      setIsSearch(false);
    }
  }, [searchKey]);

  useEffect(() => {
    console.log("categoryData", data);
    if (isSuccess) {
      setKeywordList(data.data || []);
    }
  }, [setKeywordList, data, isSuccess]);

  const handleRemoveHistory = (item: any) => {
    const newHistoryList = [...historyList];
    const index = newHistoryList.findIndex((data) => data.id === item.id);
    newHistoryList.splice(index, 1);

    storage.set(Configs.HistoryList, JSON.stringify(newHistoryList));
    setHistoryList(newHistoryList);
  };

  const handleSetHistoryList = (item?: any) => {
    const historyText = item ? item.searchTerms : searchKey;
    const newHistoryList = [...historyList];
    const index = newHistoryList.findIndex((item) => item.text === historyText);
    if (index > -1) {
      newHistoryList.splice(index, 1);
      newHistoryList.unshift({
        text: historyText,
        id: Date.now(),
      });
    } else {
      newHistoryList.unshift({
        text: historyText,
        id: Date.now(),
      });
    }

    storage.set(Configs.HistoryList, JSON.stringify(newHistoryList));
    setHistoryList(newHistoryList);
  };

  const handleSearch = (item: any) => {
    setSearchKey(item.searchTerms);
    handleSetHistoryList(item);
    setIsSearch(true);
  };
  const handleSubmitEditing = (event: any) => {
    console.log(event);
    if (!searchKey) {
      return;
    }
    handleSetHistoryList();
    setIsSearch(true);
  };

  const RightAction = (item: any) => {
    return (prog: SharedValue<number>, drag: SharedValue<number>) => {
      const styleAnimation = useAnimatedStyle(() => {
        console.log("showRightProgress:", prog.value);
        console.log("appliedTranslation:", drag.value);

        return {
          transform: [{ translateX: drag.value + 50 }],
        };
      });

      return (
        <Reanimated.View style={styleAnimation}>
          <View style={styles.rightAction}>
            <Pressable
              onPress={() => handleRemoveHistory(item)}
              style={styles.rightBtn}
            >
              <Text style={[styles.rightBtnText, { color: colors.gray1600 }]}>
                {"Delete"}
              </Text>
            </Pressable>
          </View>
        </Reanimated.View>
      );
    };
  };

  return (
    <SafeScreen edges={[]} style={[styles.safeScreen, backgrounds.gray1600]}>
      <SearchContext.Provider
        value={{
          searchKey,
        }}
      >
        <StatusBar
          backgroundColor={navigationTheme.colors.background}
          barStyle={variant === "dark" ? "light-content" : "dark-content"}
        />
        <View
          style={[
            {
              paddingTop: insets.top || StatusBar.currentHeight,
            },
            backgrounds.gray1600,
          ]}
        >
          <View style={[styles.inputWrapper]}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                source={ArrowIcon as ImageURISource}
                style={styles.arrowIcon}
              />
            </Pressable>
            <View style={[styles.inputBar]}>
              <View style={[backgrounds.gray1560, styles.inputInner]}>
                <Image
                  source={SearchIcon as ImageURISource}
                  style={styles.searchIcon}
                />
                <TextInput
                  ref={inputRef}
                  maxLength={255}
                  enterKeyHint="search"
                  label=""
                  mode="flat"
                  onChangeText={(text) => {
                    setSearchKey(text);
                  }}
                  onSubmitEditing={handleSubmitEditing}
                  placeholder={"Keyword search"}
                  underlineColor="transparent"
                  style={[styles.input]}
                  value={searchKey}
                />
              </View>
            </View>
          </View>
        </View>

        {isSearch ? (
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {
                backgroundColor: "#fff",
              },
            }}
          >
            <Tab.Screen
              component={InstitutionList}
              name={"Rehabilitation centers"}
            />
            <Tab.Screen
              component={SciencePopularizationList}
              name={"Knowledge"}
            />
            <Tab.Screen component={UpdatesList} name={"Updates"} />
          </Tab.Navigator>
        ) : (
          <ScrollView style={[styles.scrollView, backgrounds.gray1600]}>
            {historyList.length > 0 ? (
              <>
                <View style={styles.historySearch}>
                  <Text style={styles.title}>Historical Search</Text>
                  <View style={styles.historyWrapper}>
                    {historyList.map((item: any) => (
                      <ReanimatedSwipeable
                        key={item.id}
                        enableTrackpadTwoFingerGesture
                        friction={2}
                        renderRightActions={RightAction(item)}
                        rightThreshold={40}
                      >
                        <Pressable
                          onPress={() => {
                            handleSearch({
                              searchTerms: item.text,
                            });
                          }}
                          style={styles.history}
                        >
                          <Text style={styles.historyText}>{item.text}</Text>
                          <Image
                            source={ArrowRightIcon as ImageURISource}
                            style={styles.arrowRightIcon}
                          />
                        </Pressable>
                      </ReanimatedSwipeable>
                    ))}
                  </View>
                </View>

                <Divider />
              </>
            ) : undefined}
            <View style={styles.popularSearch}>
              <Text style={styles.title}>Popular Search Terms</Text>
              <View style={styles.termsWrapper}>
                {keywordList.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      handleSearch(item);
                    }}
                    style={styles.terms}
                  >
                    <Text style={styles.termsText}>{item.searchTerms}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </SearchContext.Provider>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    width: 22,
    height: 22,
  },
  searchIcon: {
    width: 14,
    height: 14,
  },
  arrowRightIcon: {
    width: 11,
    height: 15,
  },
  history: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historySearch: {
    marginTop: 25,
    marginBottom: 6,
  },
  historyText: {
    fontSize: 15,
    fontWeight: 500,
  },
  historyWrapper: {
    marginTop: 16,
  },
  inputInner: {
    alignItems: "center",
    borderRadius: 22,
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  input: {
    height: 46,
    flex: 1,
    backgroundColor: "transparent",
  },
  inputBar: {
    flex: 1,
  },
  inputWrapper: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pagerView: {
    flex: 1,
  },
  popularSearch: {
    paddingVertical: 26,
  },

  rightAction: {
    width: 73,
    alignItems: "flex-end",
  },
  rightBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 53,
    height: 53,
    backgroundColor: "#E05E58",
    borderRadius: 12,
  },
  rightBtnText: {
    fontSize: 14,
    fontWeight: 500,
  },
  safeScreen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  terms: {
    alignItems: "center",
    borderRadius: 12,
    borderStyle: "solid",
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  termsText: {
    fontSize: 15,
    fontWeight: 500,
  },
  termsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 26,
    paddingHorizontal: 20,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
});
