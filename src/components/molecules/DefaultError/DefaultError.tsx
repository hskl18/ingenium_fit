import * as React from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "@/theme";

import { IconByVariant } from "@/components/atoms";

type Properties = {
  readonly onReset?: () => void;
};

function DefaultErrorScreen({ onReset = undefined }: Properties) {
  const { colors, fonts, gutters, layout } = useTheme();
  const { resetBoundary } = useErrorBoundary();

  return (
    <View
      style={[
        layout.flex_1,
        layout.justifyCenter,
        layout.itemsCenter,
        gutters.gap_16,
        gutters.padding_16,
      ]}
    >
      <IconByVariant
        height={42}
        path="fire"
        stroke={colors.red500}
        width={42}
      />
      <Text style={[fonts.gray300, fonts.bold, fonts.size_16]}>
        Something went wrong
      </Text>
      <Text style={[fonts.gray0, fonts.size_12, fonts.alignCenter]}>
        An unexpected error occurred.
      </Text>

      {onReset ? (
        <TouchableOpacity
          onPress={() => {
            resetBoundary();
            onReset();
          }}
        >
          <Text style={[fonts.gray0, fonts.size_16]}>Try again</Text>
        </TouchableOpacity>
      ) : undefined}
    </View>
  );
}

export default DefaultErrorScreen;
