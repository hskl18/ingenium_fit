import type { InfiniteData } from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import GalleryPreview from "react-native-gallery-preview";
import { Text, View, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Appbar, Avatar } from "react-native-paper";

import { Paths } from "@/navigation/paths.ts";
import { RootScreenProps } from "@/navigation/types.ts";
import { useTheme } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  leaveWordContentList,
  leaveWordDetail,
  sendLeaveWord,
} from "@/services";
import { useUserStore } from "@/store";

import {
  renderInputToolbar,
  renderComposer,
  renderSend,
} from "./components/InputToolbar";
import {
  renderAvatar,
  renderBubble,
  renderSystemMessage,
  renderMessage,
  renderMessageText,
  renderCustomView,
} from "./components/MessageContainer";
import { SafeScreen } from "@/components/templates";

import Toast from "react-native-root-toast";
import { requestAssistantReply } from "@/services/openai";
import {
  pasadenaPrograms,
  pasadenaRehabCenters,
} from "@/data/pasadenaContent";
const DEFAULT_AVATAR_URI =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces&auto=format";

const navigatorDemoReply = () => {
  const program = pasadenaPrograms?.[0];
  const rehab = pasadenaRehabCenters?.[0];

  if (!program || !rehab) {
    return "I'm pulling together Pasadena tips for you. Ask about programs, transport, or funding and I'll share what I have!";
  }

  return `While I'm getting fully online, here's a Pasadena snippet: try ${program.name} at ${program.location} (${program.schedule}). If you need support, ${rehab.name} on ${rehab.address} has great adaptive rehab services.`;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

interface LeaveWordInfo {
  id?: string;
  user?: {
    id?: string;
    nickName?: string;
    avatar?: string;
  };
}

interface UserInfo {
  id: string;
  nickName: string;
  avatar: string;
}

function ChatDetail({ route, navigation }: RootScreenProps<Paths.ChatDetail>) {
  const { backgrounds, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    userId: routeUserId,
    initialPrompt,
    assistantOnly: routeAssistantOnly,
  } = route.params ?? {};
  const normalizedUserId = routeUserId?.toLowerCase?.() ?? "";
  const assistantOnly =
    routeAssistantOnly ?? (!routeUserId || normalizedUserId === "assistant");
  const [leaveWordInfo, setLeaveWordInfo] = useState<LeaveWordInfo>({});

  const [text, setText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [hasProcessedInitialPrompt, setHasProcessedInitialPrompt] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<any[]>([]);
  const userInfo = useUserStore((state: any) => state.userInfo) as UserInfo;
  const queryClient = useQueryClient();
  const chatQueryKey = useMemo(
    () => [
      Paths.ChatDetail,
      "leaveWordContentList",
      leaveWordInfo?.id ?? routeUserId ?? "assistant",
    ],
    [leaveWordInfo?.id, routeUserId]
  );

  useEffect(() => {
    if (!assistantOnly) {
      setAssistantMessages([]);
    }
  }, [assistantOnly]);

  const assistantProfile = useMemo(() => {
    const user = leaveWordInfo.user || {};
    return {
      id: user.id ?? "assistant",
      nickName: user.nickName ?? "AI Navigator",
      avatar: user.avatar ?? DEFAULT_AVATAR_URI,
    };
  }, [leaveWordInfo.user]);

  const appendMessageToCache = useCallback(
    (newMessage: any) => {
      if (assistantOnly) {
        setAssistantMessages((previous) => {
          const withoutDuplicate = previous.filter(
            (message) => message.id !== newMessage.id
          );
          return [newMessage, ...withoutDuplicate];
        });
        return;
      }
      queryClient.setQueryData<InfiniteData<any>>(chatQueryKey, (old) => {
        if (!old) {
          return {
            pageParams: [1],
            pages: [{ rows: [newMessage], items: [newMessage] }],
          } as InfiniteData<any>;
        }

        const pages = old.pages.map((page, index) => {
          if (index === 0) {
            const existingRows = Array.isArray(page?.rows)
              ? page.rows
              : Array.isArray(page?.items)
              ? page.items
              : [];
            const updatedRows = [newMessage, ...existingRows];
            return { ...page, rows: updatedRows, items: updatedRows };
          }
          return page;
        });

        return { ...old, pages };
      });
    },
    [assistantOnly, chatQueryKey, queryClient]
  );

  const buildHistoryForAssistant = useCallback(
    (additionalMessages: any[] = []) => {
      if (assistantOnly) {
        const combinedAssistantMessages = [...assistantMessages, ...additionalMessages];
        combinedAssistantMessages.sort((a, b) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
        );

        return combinedAssistantMessages
          .map((item) => ({
            role: item.sendUserId === userInfo.id ? "user" : "assistant",
            content: item.messageContent ?? "",
          }))
          .filter((entry) => isNonEmptyString(entry.content));
      }

      const cached = queryClient.getQueryData<InfiniteData<any>>(chatQueryKey);
      const existingMessages = cached
        ? cached.pages.flatMap((page) => {
            const rows = Array.isArray(page?.rows)
              ? page.rows
              : Array.isArray(page?.items)
              ? page.items
              : [];
            return rows;
          })
        : [];

      const combined = [...existingMessages, ...additionalMessages];
      combined.sort(
        (a, b) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      );

      return combined
        .map((item) => ({
          role: item.sendUserId === userInfo.id ? "user" : "assistant",
          content: item.messageContent ?? "",
        }))
        .filter((entry) => isNonEmptyString(entry.content));
    },
    [assistantMessages, assistantOnly, chatQueryKey, queryClient, userInfo.id]
  );

  const handleAssistantReply = useCallback(
    async (promptText: string, latestUserMessage: any) => {
      if (!assistantOnly) {
        return;
      }
      try {
        setIsAssistantTyping(true);
        const history = buildHistoryForAssistant([latestUserMessage]);
        const trimmedHistory = history.slice(-10);
        const reply = await requestAssistantReply([
          {
            role: "system",
            content:
              "You are Ingenium Fit's adaptive sports navigator. Offer concise, encouraging guidance for adaptive athletes and reference Pasadena resources when it helps.",
          },
          ...trimmedHistory,
          { role: "user", content: promptText },
        ]);

        const responseText = isNonEmptyString(reply)
          ? reply
          : navigatorDemoReply();

        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          messageContent: responseText,
          messageType: 1,
          createTime: new Date().toISOString(),
          sendUserId: assistantProfile.id,
          userName: assistantProfile.nickName,
          userAvatar: assistantProfile.avatar,
        };

        appendMessageToCache(assistantMessage);
      } catch (error) {
        console.error("Assistant reply error", error);

        const fallbackMessage = {
          id: `assistant-fallback-${Date.now()}`,
          messageContent: navigatorDemoReply(),
          messageType: 1,
          createTime: new Date().toISOString(),
          sendUserId: assistantProfile.id,
          userName: assistantProfile.nickName,
          userAvatar: assistantProfile.avatar,
        };

        appendMessageToCache(fallbackMessage);

        Toast.show("Assistant switched to offline demo replies.", {
          animation: true,
          delay: 0,
          duration: 1400,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      } finally {
        setIsAssistantTyping(false);
      }
    },
    [
      appendMessageToCache,
      assistantOnly,
      assistantProfile.avatar,
      assistantProfile.id,
      assistantProfile.nickName,
      buildHistoryForAssistant,
    ]
  );

  const onPreview = (imgs: any) => {
    setImages(imgs);
    setIsVisible(true);
  };

  const handleOnPress = (context, message) => {
    if (+message.messageType === 2) {
      onPreview([
        {
          uri: message.image,
        },
      ]);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: " ",
      headerBackTitleVisible: false,
      headerTitle: assistantOnly
        ? "AI Navigator"
        : leaveWordInfo.user?.nickName || assistantProfile.nickName || "Conversation",
      headerLeft: () => (
        <Appbar.BackAction
          accessibilityHint="Go back"
          accessibilityLabel="Back"
          color={colors.gray1100}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <Avatar.Image size={32} source={{ uri: assistantProfile.avatar }} />
      ),
    });
  }, [assistantOnly, assistantProfile.avatar, assistantProfile.nickName, colors.gray900, leaveWordInfo.user, navigation]);

  const { data: leaveWordData, isSuccess: leaveWordDataIsSuccess } = useQuery({
    enabled: Boolean(routeUserId) && !assistantOnly,
    queryFn: () => leaveWordDetail({ userId: routeUserId }),
    queryKey: [Paths.ChatDetail, "leaveWordDetail", routeUserId],
  });

  useEffect(() => {
    if (leaveWordDataIsSuccess) {
      const detail = (leaveWordData?.data as LeaveWordInfo | undefined) || {};
      const resolvedId = detail.id || (leaveWordData as any)?.leaveWordId || routeUserId;

      setLeaveWordInfo({
        ...detail,
        id: resolvedId,
      });
    }
  }, [leaveWordData, leaveWordDataIsSuccess, routeUserId]);

  const mutation = useMutation({
    mutationFn: sendLeaveWord,
    onError: (error) => {
      console.error("Failed to send message", error);
      Toast.show("Failed to send message", {
        animation: true,
        delay: 0,
        duration: 1200,
        hideOnPress: true,
        position: Toast.positions.CENTER,
        shadow: true,
      });
    },
    onSuccess: (response: IResponseData) => {
      if (response.code === 200) {
        if (!assistantOnly) {
          queryClient.invalidateQueries({ queryKey: chatQueryKey });
        }
        Toast.show("Message sent successfully!", {
          animation: true,
          delay: 0,
          duration: 1000,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
      }
    },
  });

  const leaveWordId = assistantOnly
    ? undefined
    : leaveWordInfo?.id ?? routeUserId;
  const {
    isPending,
    data,
    isFetching,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 1,
    enabled: !assistantOnly && Boolean(leaveWordId),
    getNextPageParam: (lastPage: any, allPages: any, lastPageParam: number) => {
      const rows = Array.isArray(lastPage?.rows)
        ? lastPage.rows
        : Array.isArray(lastPage?.items)
        ? lastPage.items
        : [];
      if (rows.length < 20) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    queryFn: ({ pageParam }) => {
      return leaveWordContentList({
        leaveWordId,
        page: pageParam,
        pageSize: 20,
      });
    },
    queryKey: chatQueryKey,
  });

  const onSend = useCallback(
    (newMessages: any[] = []) => {
      const outgoingText = newMessages[0]?.text ?? text;
      const trimmed = outgoingText?.trim?.();

      if (!trimmed) {
        setText(trimmed ?? "");
        return;
      }

      if (!assistantOnly && !leaveWordId) {
        setText("");
        Toast.show("No conversation selected", {
          animation: true,
          delay: 0,
          duration: 1200,
          hideOnPress: true,
          position: Toast.positions.CENTER,
          shadow: true,
        });
        return;
      }

      const timestamp = new Date().toISOString();
      const userMessage = {
        id: `local-${timestamp}`,
        messageContent: trimmed,
        messageType: 1,
        createTime: timestamp,
        sendUserId: userInfo.id,
        userName: userInfo.nickName,
        userAvatar: userInfo.avatar,
      };

      appendMessageToCache(userMessage);
      setText("");
      if (!assistantOnly && leaveWordId) {
        mutation.mutate({
          leaveWordId,
          messageContent: trimmed,
          messageType: 1,
        });
      }

      if (assistantOnly) {
        handleAssistantReply(trimmed, userMessage);
      }
    },
    [
      appendMessageToCache,
      assistantOnly,
      handleAssistantReply,
      leaveWordId,
      mutation,
      userInfo.avatar,
      userInfo.id,
      userInfo.nickName,
      text,
    ]
  );

  useEffect(() => {
    if (!assistantOnly || hasProcessedInitialPrompt) {
      return;
    }

    if (isNonEmptyString(initialPrompt)) {
      onSend([{ text: initialPrompt }]);
      setHasProcessedInitialPrompt(true);
      return;
    }

    const welcomeMessage = {
      id: `assistant-${Date.now()}`,
      messageContent:
        "Hi! I'm your Ingenium AI navigator. Ask for ideas, plans, or resources any time.",
      messageType: 1,
      createTime: new Date().toISOString(),
      sendUserId: assistantProfile.id,
      userName: assistantProfile.nickName,
      userAvatar: assistantProfile.avatar,
    };

    appendMessageToCache(welcomeMessage);
    setHasProcessedInitialPrompt(true);
  }, [
    appendMessageToCache,
    assistantOnly,
    assistantProfile.avatar,
    assistantProfile.id,
    assistantProfile.nickName,
    hasProcessedInitialPrompt,
    initialPrompt,
    onSend,
  ]);

  const transformMessages = (items: any[] = []) => {
    return items.map((item: any) => {
      const baseMessage = {
        _id: item.id,
        createdAt: new Date(item.createTime),
        user: {
          _id: item.sendUserId,
          name: item.userName,
          avatar: item.userAvatar,
        },
        messageType: item.messageType,
      };

      switch (+item.messageType) {
        case 1:
          return {
            ...baseMessage,
            text: item.messageContent,
          };
        case 2:
          return {
            ...baseMessage,
            image: item.messageContent,
          };
        case 3:
          return {
            ...baseMessage,
            audio: item.messageContent,
            duration: item.duration,
            text: "Voice Message",
          };
        default:
          return {
            ...baseMessage,
            text: item.messageContent,
          };
      }
    });
  };

  let messages: any[] = [];
  if (assistantOnly) {
    messages = transformMessages(assistantMessages);
  } else if (data?.pages) {
    messages = data.pages.flatMap((page: any) => {
      const pageRows = Array.isArray(page?.rows)
        ? page.rows
        : Array.isArray(page?.items)
        ? page.items
        : [];

      return transformMessages(pageRows);
    });
  }

  messages = messages.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleLoadEarlier = () => {
    if (isPending || isFetching || isFetchingNextPage || !hasNextPage) {
      return;
    }
    fetchNextPage();
  };

  return (
    <SafeScreen
      edges={["bottom"]}
      style={[styles.container, backgrounds.gray1550]}
    >
      <GiftedChat
        placeholder="Ask the Pasadena navigator anything…"
        alignTop
        alwaysShowSend
        bottomOffset={Math.max(insets.bottom, 12)}
        infiniteScroll
        isLoadingEarlier={isFetchingNextPage}
        isTyping={isAssistantTyping}
        isScrollToBottomEnabled
        keyboardShouldPersistTaps="handled"
        loadEarlier={hasNextPage}
        messages={messages}
        messagesContainerStyle={[backgrounds.gray1550, styles.messagesContainer]}
        onInputTextChanged={setText}
        onLoadEarlier={handleLoadEarlier}
        onPress={handleOnPress}
        onSend={onSend}
        parsePatterns={(linkStyle) => [
          {
            pattern: /#(\w+)/,
            style: linkStyle,
            onPress: () => undefined,
          },
        ]}
        renderActions={() => null}
        renderAvatar={renderAvatar}
        renderAvatarOnTop
        renderBubble={renderBubble}
        renderComposer={renderComposer}
        renderInputToolbar={renderInputToolbar}
        renderMessage={renderMessage}
        renderMessageText={renderMessageText}
        renderSend={renderSend}
        showAvatarForEveryMessage
        showUserAvatar
        text={text}
        user={{
          _id: userInfo.id,
          name: userInfo.nickName,
          avatar: userInfo.avatar,
        }}
      />
      <GalleryPreview
        images={images}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 8,
  },
});

export default ChatDetail;
