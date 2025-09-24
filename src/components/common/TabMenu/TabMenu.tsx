import React, { useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/theme";

type TabItem = {
  name: string;
  [key: string]: any;
};

type Props = {
  tabs: (string | TabItem)[];
  tabIndex: number;
  setTabIndex: (index: number) => void;
};

const TabMenu = ({ tabs, tabIndex, setTabIndex }: Props) => {
  const scrollViewRef = useRef(null);
  const [layoutCount, setLayoutCount] = useState(0);
  const underlineAnimation = new Animated.Value(tabIndex);
  const tabWidths = React.useRef(tabs.map(() => 0));
  const tabPositions = React.useRef(tabs.map(() => 0));

  const getTabKey = (tab: string | TabItem, index: number) => {
    return typeof tab === "string" ? tab : tab.name;
  };
  const { colors } = useTheme();
  const animateUnderline = (index: number) => {
    Animated.timing(underlineAnimation, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleTabPress = (index: number) => {
    animateUnderline(index);
    setTabIndex(index);
    // scrollViewRef.current?.scrollTo({
    //   x: underlineWidth,
    // });
  };

  const onTabLayout = (event: LayoutChangeEvent, index: number) => {
    console.log("event", event, index);
    console.log("event", event.nativeEvent);
    const { width } = event.nativeEvent.layout;
    tabWidths.current[index] = width;
    // Calculate the position of each tab based on the width of the tabs
    // [width1, width1 + width2, width1 + width2 + width3, ...]
    tabPositions.current = tabWidths.current.map((_, anIndex: number) =>
      tabWidths.current.slice(0, anIndex + 1).reduce((acc, curr) => acc + curr)
    );
    tabPositions.current.unshift(0);
    tabPositions.current.pop();
    // Force a re-render after all tabs have been laid out
    setLayoutCount(layoutCount + 1);
  };

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <TouchableOpacity
        key={getTabKey(tab, index)}
        activeOpacity={0.7}
        style={[styles.tab]}
        onLayout={(event) => onTabLayout(event, index)}
        onPress={() => handleTabPress(index)}
      >
        <Text
          style={{
            ...styles.tabText,
            color: tabIndex === index ? colors.primary : colors.gray800,
          }}
        >
          {getTabKey(tab, index)}
        </Text>
      </TouchableOpacity>
    ));
  };

  const underlinePosition = underlineAnimation.interpolate({
    inputRange: tabPositions.current.map((_, index) => index),
    outputRange: tabPositions.current.map((position) => position),
  });
  const underlineWidth = underlineAnimation.interpolate({
    inputRange: tabWidths.current.map((_, index) => index),
    outputRange: tabWidths.current.map((width) => width),
  });

  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.tabContainer}>
        {renderTabs()}
        <Animated.View
          style={[
            styles.underline,
            { left: underlinePosition, width: underlineWidth },
          ]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    marginLeft: 20,
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 500,
  },
  underline: {
    backgroundColor: "#0077D2",
    bottom: 0,
    height: 3,
    position: "absolute",
    width: 66,
  },
});

export default TabMenu;
