// Simple hooks for demo app
export const useI18n = () => {
  return {
    language: "en-EN",
    changeLanguage: (lang: string) => {
      console.log("Language changed to:", lang);
    },
    toggleLanguage: (lang: string) => {
      console.log("Language toggled to:", lang);
    },
  };
};

export const useTranslation = () => {
  // Lightweight dictionary for commonly used keys
  const dictionary: Record<string, string> = {
    // Error boundary
    "error_boundary.title": "Something went wrong",
    "error_boundary.description": "An unexpected error occurred.",
    "error_boundary.cta": "Try again",

    // Common
    "common.distance": "Distance",
    "common.accessibility_supports": "Accessibility supports",
    "common.search_for_service": "Search for services",
    "common.adaptive_sport_navigator": "Adaptive Sport Navigator",
    "common.hero_tagline": "Start your adaptive sports journey",
    "common.hero_description":
      "Discover programs, plan transit, and get support.",
    "common.start_navigator_call": "Start navigator call",
    "common.quick_actions": "Quick actions",
    "common.quick_actions_subtitle": "Jump into the most common tasks",
    "common.navigator_workflow": "Navigator workflow",
    "common.navigator_workflow_subtitle":
      "How it works from intake to activity",
    "common.transit_equipment_spotlights": "Transit & equipment spotlights",
    "common.transit_equipment_spotlights_subtitle":
      "Highlights from the community",
    "common.popular_categories": "Popular categories",
    "common.recommended_science": "Recommended knowledge",
    "common.recommended_posts": "Recommended posts",
    "common.rehabilitation_center": "Rehabilitation centers",
    "common.rehabilitation_centre": "Rehabilitation centers",
    "common.view_all": "View all",
    "common.no_data": "No data",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.sort_by": "Sort by",
    "common.default_collation": "Default",
    "common.closest_distance": "Closest distance",
    "common.highest_rating": "Highest rating",
    "common.confirm": "Confirm",
    "common.rating": "Rating",
    "common.within": "Within",
    "common.over": "Over",
    "common.home": "Home",
    "common.care_network_title": "Your care network",
    "common.care_network_description":
      "Find centers and professionals near you.",

    // Tabbar
    "tabbar.home": "Home",
    "tabbar.dynamic": "Updates",
    "tabbar.profile": "Profile",

    // Titles
    "title.message_notifications": "Message notifications",
    "title.select_location": "Select location",
    "title.rehabilitation_center": "Rehabilitation centers",
    "title.evaluate_physician": "Evaluate physician",
    "title.evaluate": "Evaluate",
    "title.chat_message": "Chat",
    "title.detail": "Detail",
    "title.publish": "Publish",
    "title.my_updates": "My updates",
    "title.personal_information": "Personal information",
    "title.faq": "FAQ",
    "title.settings": "Settings",
    "title.change_password": "Change password",
    "title.forgot_password": "Forgot password",
    "title.collection": "Collection",
    "title.fans_follow": "Fans & following",
    "title.nickname": "Nickname",
    "title.introduction": "Introduction",

    // Profile
    "profile.profile": "Profile",
    "profile.my_updates": "My updates",
    "profile.personal_information": "Personal information",
    "profile.language": "Language",
    "profile.faq": "FAQ",
    "profile.settings": "Settings",
    "agreement.privacy_policy": "Privacy policy",
  };

  const humanize = (text: string): string => {
    const words = text
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
    return words || text;
  };

  const t = (key: string): string => {
    if (!key) return "";
    if (dictionary[key]) return dictionary[key];
    const last = key.includes(".") ? key.split(".").pop() || key : key;
    return humanize(last);
  };

  return {
    t,
    i18n: {
      language: "en-EN",
      changeLanguage: (lang: string) => Promise.resolve(),
    },
  };
};
