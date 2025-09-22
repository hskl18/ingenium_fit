import { useRef, useState } from 'react';
import { useTranslation } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import MapView, { Marker } from 'react-native-maps';
import { useShallow } from 'zustand/react/shallow';

import { Paths } from '@/navigation/paths.ts';
import { RootScreenProps } from '@/navigation/types.ts';
import { useTheme } from '@/theme';

import { storage } from '@/App.tsx';
import { Configs } from '@/common/configs.ts';
import { useLocationStore, FALLBACK_LOCATION } from '@/store';
export default function SelectLocation({
  route,
  navigation,
}: RootScreenProps<Paths.SelectLocation>) {
  const { source } = route.params;
  const { t } = useTranslation();
  const [location, setLocation] = useLocationStore(
    useShallow((state) => [state.location, state.setLocation]),
  );

  const { backgrounds } = useTheme();
  const map = useRef<MapView>(null);
  const handleSelectLocation = (event: any) => {
    console.log('event', event);
  };
  const handlePlaceSelect = (place) => {
    console.log('Selected place:', place);
    const { location: newLocation, displayName } = place.details;
    console.log(newLocation);
    console.log(displayName);
    setLocation({
      coords: newLocation,
      city: displayName.text,
    });
    storage.set(
      Configs.Location,
      JSON.stringify({
        coords: newLocation,
        city: displayName.text,
      }),
    );
    if (source === Paths.ObtainPosition) {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Tabbar }],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[{ flex: 1 }, backgrounds.gray1600]}>
      <View style={styles.searchWrapper}>
        <GooglePlacesTextInput
          apiKey={Configs.GoogleApiKey}
          fetchDetails
          placeHolderText={t('common.search_location')}
          onPlaceSelect={handlePlaceSelect}
          style={{
            container: {},
            suggestionsContainer: {
              ...backgrounds.gray1600,
            },
          }}
        />
      </View>

      <MapView
        ref={map}
        initialCamera={{
          center: {
            ...(location?.coords || FALLBACK_LOCATION.coords),
          },
          pitch: 45,
          heading: 90,
          altitude: 1000,
          zoom: 10,
        }}
        showsUserLocation
        onPress={handleSelectLocation}
        style={styles.map}
      >
        {location?.coords ? (
          <Marker
            draggable
            coordinate={{
              ...(location?.coords || FALLBACK_LOCATION.coords),
            }}
            onDragEnd={(event: any) => {
              console.log('drag', event);
            }}
          />
        ) : undefined}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    flex: 1,
  },
  searchWrapper: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
});
