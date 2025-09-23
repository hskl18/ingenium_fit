import type { ImageProps, ImageURISource } from "react-native";

import React, { useMemo, useState } from "react";
import { Image, View, StyleSheet } from "react-native";

import Skeleton from "@/components/atoms/Skeleton/Skeleton";
import { DEFAULT_PLACEHOLDER, normalizeImageUrl } from "@/utils/image";

type Properties = Omit<ImageProps, "source"> & {
  readonly uri?: string | null;
  readonly placeholderSource?: number | ImageURISource;
  readonly showSkeleton?: boolean;
};

export default function ImageWithFallback({
  uri,
  placeholderSource = DEFAULT_PLACEHOLDER as unknown as number,
  showSkeleton = true,
  onError,
  onLoad,
  style,
  ...rest
}: Properties) {
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(uri));
  const [failed, setFailed] = useState<boolean>(false);

  const normalized = useMemo(() => normalizeImageUrl(uri || undefined), [uri]);

  const handleLoad = (...args: any[]) => {
    setIsLoading(false);
    onLoad?.(...(args as any));
  };

  const handleError = (...args: any[]) => {
    setIsLoading(false);
    setFailed(true);
    onError?.(...(args as any));
  };

  const shouldShowPlaceholder = failed || !normalized;

  return (
    <View style={[style, { overflow: "hidden" }]}>
      {shouldShowPlaceholder ? (
        <Image
          source={placeholderSource}
          style={StyleSheet.absoluteFillObject}
          {...rest}
        />
      ) : (
        <>
          {showSkeleton ? (
            <Skeleton
              loading={isLoading}
              height={"100%"}
              width={"100%"}
              style={StyleSheet.absoluteFillObject}
              pointerEvents="none"
            />
          ) : null}
          <Image
            source={{ uri: normalized }}
            defaultSource={placeholderSource as number}
            onError={handleError}
            onLoad={handleLoad}
            style={StyleSheet.absoluteFillObject}
            {...rest}
          />
        </>
      )}
    </View>
  );
}
