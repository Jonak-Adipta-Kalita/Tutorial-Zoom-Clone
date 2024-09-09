import React, { useState } from "react";
import {
  TextInput,
  View,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Text,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Button from "@/src/components/Button";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert(
        "Whoops!",
        "Looks like something is wrong\n\nPlease try again."
      );
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        throw new Error("Sign up failed");
      }
    } catch (err: any) {
      Alert.alert(
        "Whoops!",
        "Looks like something is wrong\n\nPlease try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-center px-[20px] bg-[#5F5DEC]"
    >
      {!pendingVerification && (
        <View className="gap-[10px]">
          <Text className="text-white text-[18px] text-center mb-[20px]">
            {"Enter your details to get started"}
          </Text>
          <TextInput
            className="p-[20px] w-full bg-white rounded-[10px]"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            className="p-[20px] w-full bg-white rounded-[10px]"
            value={password}
            placeholder="Password..."
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button title="Sign Up" onPress={onSignUpPress} />
        </View>
      )}
      {pendingVerification && (
        <>
          <Text className="text-white text-[18px] text-center mb-[20px]">
            A verification code has been sent to your email address. Please
            enter it below.
          </Text>
          <TextInput
            className="p-[20px] w-full mb-[10px] bg-white rounded-[10px]"
            value={code}
            placeholder="Code..."
            onChangeText={(code) => setCode(code)}
          />
          <Button title="Verify Email" onPress={onPressVerify} />
        </>
      )}
    </KeyboardAvoidingView>
  );
}
