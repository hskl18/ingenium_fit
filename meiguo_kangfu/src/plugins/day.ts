import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// 引入语言包
import En from 'dayjs/locale/en';
import ZhCn from 'dayjs/locale/zh-cn';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

function setDayjsLocale() {
  // const localeLanguages = uni.getLocale()
  // console.log('localeLanguages', localeLanguages)
  // localeLanguages === 'zh-Hans' && dayjs.locale(ZhCn)
  // localeLanguages === 'en' && dayjs.locale(En)
}

export { setDayjsLocale };
export { dayjs };
