import dayjs from 'dayjs'

/**
 * @typedef {object} AccountPeriod
 * @property {Number} yearEnd
 * @property {Number} monthEnd
 */

/**
 * @description 判断是否超出统计月
 * @param fillingMonth {{year: Number, month: Number}} 填报月份
 * @param accountPeriod {AccountPeriod} 台账周期
 * @return Boolean
 */
export function isOverInspectionMonth ({
  year: composingDateY,
  month: composingDateM
}, {
  yearEnd,
  monthEnd
}) {
  let { $y: curYear, $M: curMonth, $D: curDay } = dayjs()
  curMonth += 1
  return (
    curYear * 12 + (
      curDay > (curMonth === 12 ? yearEnd : monthEnd)
        ? curMonth + 1
        : curMonth
    )
  ) < (composingDateY * 12 + composingDateM)
}

/**
 * @typedef {object} PeriodRange
 * @property {Date} periodStartDate
 * @property {Date} periodEndDate
 */
/**
 * @description 获取目标时间点最新已完成统计的账期的起始时间
 * @param targetDate {Date} 目标时间
 * @param accountPeriod {AccountPeriod} 台账周期
 * @returns PeriodRange
 */
export function getLastestCompletedPeriodRange (targetDate = new Date(), {
  yearEnd,
  monthEnd
}) {
  // targetDate
  let { $y: curYear, $M: curMonth, $D: curDay } = dayjs(targetDate)
  curMonth += 1
  // 获取统计账期
  const lastestCompletedPeriod = {
    year: (curMonth === 1 && curDay < monthEnd) ? curYear - 1 : curYear,
    month: (curDay > (curMonth === 12 ? yearEnd : monthEnd))
      ? curMonth
      : curMonth === 1
        ? 12
        : curMonth - 1
  }
  // new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
  return {
    periodStartDate: lastestCompletedPeriod.month !== 1
      ? new Date(
        lastestCompletedPeriod.year,
        lastestCompletedPeriod.month - 2,
        monthEnd + 1
      )
      : new Date(lastestCompletedPeriod.year - 1, 11, yearEnd + 1),
    periodEndDate: new Date(
      lastestCompletedPeriod.year,
      lastestCompletedPeriod.month - 1,
      lastestCompletedPeriod.month === 12 ? yearEnd : monthEnd
    )
  }
}
