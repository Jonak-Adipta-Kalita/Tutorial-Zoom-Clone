import {
  Alert,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useCallback, useState } from "react";
import { Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import Divider from "@/src/components/Divider";
import Button from "@/src/components/Button";
import SignInWithOAuth from "@/src/components/SignInWithOAuth";

export default () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        throw new Error("Sign in failed");
      }
    } catch (err: any) {
      Alert.alert(
        "Whoops!",
        "Looks like something is wrong with your Credentials\n\nPlease try again."
      );
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#5F5DEC] px-[20px] justify-center gap-[10px]"
    >
      <MaterialIcons
        name="video-chat"
        size={160}
        color={"white"}
        className="self-center pb-[20px]"
      />
      <TextInput
        className="p-[20px] w-full bg-white rounded-[10px]"
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        className="p-[20px] w-full bg-white rounded-[10px]"
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <Divider />
      <Button title="Sign In" onPress={onSignInPress} />
      <Text className="text-center text-white">OR</Text>
      <SignInWithOAuth />
      <Divider />
      <View className="w-full justify-center items-center">
        <Text>Don't have an account?</Text>
        <Link href="./sign-up">
          <Text className="text-white font-bold underline">Sign up</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
};
