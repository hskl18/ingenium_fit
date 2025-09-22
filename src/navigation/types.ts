import type { Paths } from "@/navigation/paths";
import type { StackScreenProps } from "@react-navigation/stack";

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Agreement]: {
    code: string;
  };
  [Paths.CarouselDetail]: {
    id: string;
  };
  [Paths.ChangePassword]: undefined;
  [Paths.ChatDetail]: {
    userId: string;
  };
  [Paths.ChatMessage]: undefined;
  [Paths.Collection]: undefined;
  [Paths.Dynamic]: undefined;
  [Paths.DynamicDetail]: {
    id: string;
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
  [Paths.Home]: undefined;
  [Paths.Introduction]: undefined;
  [Paths.Login]: undefined;
  [Paths.LoginForgetPassword]: undefined;
  [Paths.Message]: undefined;
  [Paths.MyUpdates]: undefined;
  [Paths.Nickname]: undefined;
  [Paths.ObtainPosition]: undefined;
  [Paths.PersonalInformation]: undefined;
  [Paths.Profile]: undefined;
  [Paths.Register]: undefined;
  [Paths.RehabilitationCenterDetail]: {
    id: string;
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
  [Paths.SystemMessage]: undefined;
  [Paths.SystemMessageDetail]: {
    id: string;
  };
  [Paths.Tabbar]: undefined;
  [Paths.VerificationCode]: {
    email?: string;
  };
};
