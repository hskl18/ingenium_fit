import type { IResponseData } from "../types";

// Mock delay to simulate network requests
const mockDelay = (ms: number = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Pasadena sport navigator messages for research study
const navigatorMessages = [
  {
    title: "Welcome to Ingenium Fit!",
    content:
      "Hi Maria! I'm Sarah, your assigned sport navigator. I'm here to help you discover adaptive sports programs in Pasadena and connect you with our amazing community. What sports are you interested in exploring?",
    type: "welcome",
    sender: { name: "Sarah Johnson - Sport Navigator", role: "navigator" },
  },
  {
    title: "Wheelchair Basketball Program Match",
    content:
      "Great news! I found a perfect match for you - Pasadena Adaptive Basketball meets at PCC Gymnasium every Tuesday and Thursday 6-8pm. They have loaner chairs and welcome all skill levels. Would you like me to connect you with the coach?",
    type: "program_match",
    sender: { name: "Sarah Johnson - Sport Navigator", role: "navigator" },
  },
  {
    title: "Equipment Grant Opportunity",
    content:
      "I noticed you're interested in racing wheelchairs. There's a $2,500 Pasadena Adaptive Sports Equipment Grant with applications due next month. I can help you with the application process - it's much easier than it looks!",
    type: "grant_opportunity",
    sender: { name: "Mike Chen - Equipment Specialist", role: "navigator" },
  },
  {
    title: "Transportation Solution Found",
    content:
      "For getting to Rose Bowl Aquatics, the Metro Gold Line to Memorial Park station is fully accessible and only 2 blocks away. I can also connect you with our volunteer driver program if needed. Let me know what works best!",
    type: "transportation",
    sender: { name: "Alex Rodriguez - Transit Navigator", role: "navigator" },
  },
  {
    title: "Research Study Invitation",
    content:
      "You're invited to participate in our ongoing research about adaptive sports barriers and app usability. Your feedback helps improve services for the entire Pasadena adaptive sports community. Participation is voluntary and includes a $25 gift card.",
    type: "research_invitation",
    sender: { name: "Dr. Jennifer Kim - Research Team", role: "researcher" },
  },
];

const generateMockMessages = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const message = navigatorMessages[i % navigatorMessages.length];

    return {
      id: `message-${i + 1}`,
      title: message.title,
      content: message.content,
      type: message.type,
      isRead: Math.random() > 0.4, // 60% read rate
      sender: {
        id: `sender-${i + 1}`,
        name: message.sender.name,
        role: message.sender.role,
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format",
        isNavigator: message.sender.role === "navigator",
        isResearcher: message.sender.role === "researcher",
      },
      createdAt: new Date(
        Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      priority: message.type === "research_invitation" ? "high" : "normal",
      actionRequired: [
        "program_match",
        "grant_opportunity",
        "research_invitation",
      ].includes(message.type),
    };
  });
};

// Mock chat messages
const mockNavigatorProfile = {
  id: "navigator-1",
  nickName: "AI Navigator",
  avatar:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces&auto=format",
};

const mockAthleteProfile = {
  id: "athlete-1",
  nickName: "You",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces&auto=format",
};

const generateMockChatMessages = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const isNavigatorMessage = i % 2 === 0;
    const sender = isNavigatorMessage ? mockNavigatorProfile : mockAthleteProfile;

    return {
      id: `chat-${i + 1}`,
      messageContent: isNavigatorMessage
        ? "Hi! How can I help you with your adaptive sports journey today?"
        : "Thanks for reaching out! I'm looking for information about wheelchair basketball programs.",
      messageType: 1,
      createTime: new Date(Date.now() - (count - i) * 60 * 1000).toISOString(),
      sendUserId: sender.id,
      userName: sender.nickName,
      userAvatar: sender.avatar,
    };
  });
};

// Messages and notifications API calls
export const messagesApi = {
  // Get messages list
  messageList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const messages = generateMockMessages(10);

    return {
      success: true,
      data: {
        items: messages,
        total: 25,
        page: data.page || 1,
        limit: 10,
        totalPages: 3,
      },
    };
  },

  // Get message detail
  messageDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    return {
      success: true,
      data: {
        id: data.messageId,
        title: "Welcome to Adaptive Sports Navigator",
        content: `
          Welcome to the Adaptive Sports Navigator community! 
          
          We're excited to have you join our platform dedicated to connecting adaptive athletes with resources, programs, and support in the Pasadena area.
          
          Here's what you can do:
          • Discover local adaptive sports programs
          • Connect with sport navigators
          • Find rehabilitation centers and doctors
          • Join our community discussions
          • Access equipment and funding resources
          
          If you have any questions, don't hesitate to reach out to our support team or connect with a navigator.
          
          Welcome aboard!
        `,
        type: "welcome",
        isRead: false,
        sender: {
          id: "system",
          name: "Adaptive Sports Navigator",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format",
        },
        createdAt: new Date().toISOString(),
      },
    };
  },

  // Delete message
  deleteMessage: async (data: any): Promise<IResponseData> => {
    await mockDelay(400);

    return {
      success: true,
      message: "Message deleted successfully",
    };
  },

  // Mark messages as read
  readMessage: async (data: any): Promise<IResponseData> => {
    await mockDelay(300);

    return {
      success: true,
      message: "Messages marked as read",
    };
  },

  // Get unread count and latest message
  getUnReadNumAndLatest: async (): Promise<IResponseData> => {
    await mockDelay(200);

    return {
      success: true,
      data: {
        unreadCount: 3,
        latestMessage: {
          id: "latest-1",
          title: "New Program Available",
          content:
            "A new adaptive basketball program is now available in your area!",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      },
    };
  },

  // Leave word (chat) related
  leaveWordList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const conversations = Array.from({ length: 5 }, (_, i) => ({
      id: `conversation-${i + 1}`,
      participant: {
        id: `navigator-${i + 1}`,
        name: `Navigator ${["Sarah", "Mike", "Jennifer", "David", "Lisa"][i]}`,
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces&auto=format",
        isOnline: Math.random() > 0.5,
      },
      lastMessage: {
        content: `Thanks for your question about adaptive sports programs. I'll get back to you soon!`,
        timestamp: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000
        ).toISOString(),
        isFromMe: Math.random() > 0.5,
      },
      unreadCount: Math.floor(Math.random() * 3),
    }));

    return {
      success: true,
      data: {
        items: conversations,
        total: conversations.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  // Get leave word content list
  leaveWordContentList: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const messages = generateMockChatMessages(20);

    return {
      code: 200,
      success: true,
      items: messages,
      rows: messages,
      data: {
        items: messages,
        rows: messages,
        total: messages.length,
        page: data.page || 1,
        limit: 20,
        totalPages: 1,
      },
    };
  },

  // Get leave word detail
  leaveWordDetail: async (data: any): Promise<IResponseData> => {
    await mockDelay();

    const conversationId = data.conversationId || mockNavigatorProfile.id;

    return {
      code: 200,
      success: true,
      leaveWordId: conversationId,
      data: {
        id: conversationId,
        user: {
          id: mockNavigatorProfile.id,
          nickName: mockNavigatorProfile.nickName,
          avatar: mockNavigatorProfile.avatar,
        },
        title: "Sport Navigator",
        bio: "Helping adaptive athletes find their perfect sport and community in Pasadena.",
        isOnline: true,
      },
    };
  },

  // Send leave word
  sendLeaveWord: async (data: any): Promise<IResponseData> => {
    await mockDelay(500);

    return {
      code: 200,
      success: true,
      message: "Message sent successfully",
      data: {
        id: `message-${Date.now()}`,
        messageContent: data.messageContent || data.content,
        messageType: data.messageType || 1,
        createTime: new Date().toISOString(),
        sendUserId: mockAthleteProfile.id,
        userName: mockAthleteProfile.nickName,
        userAvatar: mockAthleteProfile.avatar,
        status: "sent",
      },
    };
  },

  // Get leave word unread count and latest
  getLeaveWordUnReadNumAndLatest: async (): Promise<IResponseData> => {
    await mockDelay(200);

    return {
      success: true,
      data: {
        unreadCount: 2,
        latestMessage: {
          id: "chat-latest",
          content:
            "Hi! I saw your question about wheelchair basketball. I can help you find programs in your area.",
          sender: {
            name: "Navigator Sarah",
            avatar:
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=faces&auto=format",
          },
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      },
    };
  },
};
