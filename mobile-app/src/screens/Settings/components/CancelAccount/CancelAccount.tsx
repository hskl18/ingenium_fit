import {useNavigation} from "@react-navigation/native";
import {useMutation} from "@tanstack/react-query";
import {
    Image,
    ImageURISource,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import {Button, Modal, Portal, Text} from 'react-native-paper';
import Toast from "react-native-root-toast";
import { useTranslation } from '@/hooks';

import {Paths} from "@/navigation/paths.ts";
import {useTheme} from '@/theme';

import {storage} from "@/App.tsx";
import CloseIcon from '@/assets/images/204.png';
import {logOff} from "@/services";
import { Configs } from '@/common/configs.ts';

export default function CancelAccount({
                                          hideModal,
                                          visible,
                                      }: {
    readonly hideModal: () => void;
    readonly visible: boolean;
}) {
    const { t } = useTranslation();
    const navigation = useNavigation()
    const {backgrounds, colors} = useTheme();
    const containerStyle = {
        backgroundColor: 'transparent',
        bottom: 0,
        left: 0,
        padding: 20,
        position: 'absolute',
        right: 0,
    };


    const mutation = useMutation({
        mutationFn: logOff,
        onError: (error) => {
            console.log('error', error);
        },
        onSuccess: (response: IResponseData) => {
            hideModal()
            if (response.code === 200) {
              storage.delete(Configs.Token);
              Toast.show(t('common.cancel_account_success'), {
                    animation: true,
                    delay: 0,
                    duration: 1000,
                    hideOnPress: true,
                    onHidden: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{name: Paths.Login}],
                        });
                    },
                    position: Toast.positions.CENTER,
                    shadow: true,
                });
            }
        },
    });

    const handleSubmit = () => {
        mutation.mutate();
    };
    return (
        <Portal>
            <Modal
                contentContainerStyle={containerStyle}
                onDismiss={hideModal}
                visible={visible}
            >
                <View style={[styles.container, backgrounds.gray1600]}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.titleText}>
                            {t('common.cancel_account_risks')}
                        </Text>
                        <Pressable onPress={hideModal}>
                            <Image
                                alt="close-icon"
                                source={CloseIcon as ImageURISource}
                                style={styles.closeIcon}
                            />
                        </Pressable>
                    </View>
                    <View style={[styles.content, backgrounds.gray1550]}>
                        <Text style={{...styles.contentText, color: colors.gray800}}>
                            {t('common.cancel_account_warning')}
                        </Text>
                    </View>
                </View>
                <Button
                    buttonColor={colors.gray1600}
                    contentStyle={[styles.button]}
                    loading={mutation.isPending}
                    mode="text"
                    onPress={handleSubmit}
                >
                    <Text style={styles.buttonText}>
                        {t('common.still_cancel_account')}
                    </Text>
                </Button>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
    },

    buttonText: {
        color: '#F2262F',
        fontSize: 15,
        fontWeight: 500,
    },
    closeIcon: {
        height: 14,
        width: 14,
    },
    container: {
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 12,
        paddingVertical: 16,
    },
    content: {
        borderRadius: 12,
        marginTop: 14,
        paddingHorizontal: 12,
        paddingVertical: 11,
    },
    contentText: {
        fontSize: 14,
        fontWeight: 500,
    },
    titleText: {
        flexShrink: 1,
        fontSize: 15,
        fontWeight: 500,
    },
    titleWrapper: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-between',
    },
});
