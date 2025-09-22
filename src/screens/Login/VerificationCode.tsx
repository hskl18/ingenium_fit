import type { RootScreenProps } from "@/navigation/types.ts";
import type { OTPInputRef } from "input-otp-native";

import { useTranslation } from "@/hooks";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { OTPInput, type SlotProps } from "input-otp-native";
import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-root-toast";

import { Paths } from "@/navigation/paths.ts";
import { useTheme } from "@/theme";
import { sendEmailSmsCode } from "@/services";

import { SafeScreen } from "@/components/templates";

export default function VerificationCode({
  navigation,
  route,
}: RootScreenProps<Paths.VerificationCode>) {
  const { backgrounds, colors, navigationTheme } = useTheme();
  const { t } = useTranslation();
  const [verificationCode, setVerificationCode] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpRef = useRef<OTPInputRef>(null);

  // Get email from route params or use default
  const email = route?.params?.email || "jwu810930@gmail.com";

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const resendMutation = useMutation({
    mutationFn: sendEmailSmsCode,
    onSuccess: (response) => {
      if (response.code === 200) {
        Toast.show("Verification code sent successfully", {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
        setResendTimer(60);
        setCanResend(false);
      }
    },
    onError: (error) => {
      Toast.show("Failed to send verification code", {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
    },
  });

  const handleResend = () => {
    if (canResend) {
      resendMutation.mutate({ email });
    }
  };

  const handleVerify = () => {
    if (verificationCode.length === 4) {
      // In a real app, you'd verify the code with your backend
      // For now, just navigate to the main app
      Toast.show("Verification successful", {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
        onHidden: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.Tabbar }],
          });
        },
      });
    } else {
      Toast.show("Please enter the complete verification code", {
        animation: true,
        delay: 0,
        duration: 1000,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
    }
  };

  const onComplete = (code: string) => {
    setVerificationCode(code);
  };

  return (
    <SafeScreen style={[styles.safeScreen, backgrounds.gray1600]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Verification</Text>
          <Text
            style={[
              styles.subtitleText,
              {
                color: colors.gray800,
              },
            ]}
          >
            We've sent a verification code to{"\n"}
            <Text style={{ color: navigationTheme.colors.primary }}>
              {email}
            </Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <OTPInput
            maxLength={4}
            onComplete={onComplete}
            ref={otpRef}
            render={({ slots }) => (
              <View style={styles.slotsContainer}>
                {slots.map((slot, index) => (
                  <Slot key={index} {...slot} />
                ))}
              </View>
            )}
          />
        </View>

        <View style={styles.resendContainer}>
          {canResend ? (
            <Button
              mode="text"
              onPress={handleResend}
              loading={resendMutation.isPending}
              textColor={navigationTheme.colors.primary}
            >
              Resend code
            </Button>
          ) : (
            <Text style={[styles.resendText, { color: colors.gray800 }]}>
              Resend code in {resendTimer}s
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            contentStyle={styles.signInButton}
            labelStyle={styles.signInButtonLabel}
            mode="contained"
            onPress={handleVerify}
            disabled={verificationCode.length !== 4}
          >
            Verify
          </Button>
        </View>
      </View>
    </SafeScreen>
  );
}

function Slot({ char, hasFakeCaret, isActive }: SlotProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.slot, isActive && styles.activeSlot]}>
      {char !== null && <Text style={styles.slotText}>{char}</Text>}
      {hasFakeCaret && (
        <View style={[styles.fakeCaret, { backgroundColor: colors.primary }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 34,
  },
  container: {
    paddingTop: 2,
  },
  safeScreen: {
    paddingHorizontal: 20,
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
  subtitleText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    textAlign: "center",
  },
  titleContainer: {
    marginBottom: 36,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  otpContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  slotsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  slot: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  activeSlot: {
    borderColor: "#0077D2",
  },
  slotText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },
  fakeCaret: {
    width: 2,
    height: 24,
    position: "absolute",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
