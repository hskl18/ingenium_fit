import type { Paths } from "@/navigation/paths";
import type { StackScreenProps } from "@react-navigation/stack";

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Agreement]: {
    code: string;
  };
  [Paths.AboutUs]: undefined;
  [Paths.CarouselDetail]: {
    id: string;
    image?: string;
    title?: string;
    description?: string;
    payload?: Record<string, unknown>;
  };
  [Paths.ChangePassword]: undefined;
  [Paths.ChatDetail]: {
    userId: string;
    assistantOnly?: boolean;
    initialPrompt?: string;
  };
  [Paths.ChatMessage]: undefined;
  [Paths.Collection]: undefined;
  [Paths.Dynamic]: undefined;
  [Paths.DynamicDetail]: {
    id: string;
    payload?: Record<string, unknown>;
    pictures?: string | string[];
    videos?: string | string[];
    image?: string;
    coverImage?: string;
    content?: string;
    title?: string;
    user?: Record<string, unknown>;
  };
  [Paths.DynamicList]: {
    selectType?: number;
    whetherRecommend?: number;
  };
  [Paths.DynamicPublish]: undefined;
  [Paths.FanAttention]: {
    name: string;
  };
  [Paths.FAQ]: undefined;
  [Paths.FollowersList]: undefined;
  [Paths.FollowingList]: undefined;
  [Paths.ForgotPassword]: undefined;
  [Paths.Login]: undefined;
  [Paths.Home]: undefined;
  [Paths.Introduction]: undefined;
  [Paths.Message]: undefined;
  [Paths.MyUpdates]: undefined;
  [Paths.Nickname]: undefined;
  [Paths.ObtainPosition]: undefined;
  [Paths.PersonalInformation]: undefined;
  [Paths.Profile]: undefined;
  [Paths.RehabilitationCenterDetail]: {
    id: string;
    payload?: Record<string, unknown>;
    coverImage?: string;
    name?: string;
    description?: string;
    distance?: string;
    star?: number | string;
    rating?: number | string;
    commentNum?: number | string;
    reviewsCount?: number | string;
  };
  [Paths.RehabilitationCenterDoctor]: {
    id: string;
  };
  [Paths.RehabilitationCenterDoctorEvaluate]: {
    id: string;
    coverImage: string;
    name: string;
  };
  [Paths.RehabilitationCenterEvaluate]: {
    id: string;
    coverImage: string;
    name: string;
  };
  [Paths.RehabilitationCenterList]: undefined;
  [Paths.SciencePopularizationDetail]: {
    id: string;
  };
  [Paths.SciencePopularizationList]: {
    id?: string;
    name?: string;
    whetherRecommend?: number;
  };
  [Paths.Search]: {
    searchKey: string;
  };
  [Paths.SelectLocation]: {
    source: string;
  };

  [Paths.Settings]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Research]: undefined;
  [Paths.SystemMessage]: undefined;
  [Paths.SystemMessageDetail]: {
    id: string;
  };
  [Paths.Tabbar]: undefined;
};
