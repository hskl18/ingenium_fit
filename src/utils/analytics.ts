import { commonApi } from "@/services/mock/common";

type AnalyticsEventProps = Record<string, unknown> | undefined;

export async function trackEvent(event: string, props?: AnalyticsEventProps) {
  try {
    await commonApi.trackEvent(event, props);
  } catch (_error) {
    // ignore in demo
  }
}

export const Analytics = {
  screen: async (name: string, props?: AnalyticsEventProps) =>
    trackEvent(`screen_${name}`, props),
  action: async (name: string, props?: AnalyticsEventProps) =>
    trackEvent(name, props),
};
