import { expect } from 'chai'
import dayjs from 'dayjs'

import { getLastestCompletedPeriodRange } from '@/libs/ec-utils'

/**
 * @typedef {object} testParamsTxt
 * @property {string} dateString 统计时间
 * @property {Number} yearEnd 年截止日期
 * @property {Number} monthEnd 月截止日期
 * @property {string} periodStartDateString 最新已完成统计的账期开始时间
 * @property {string} periodEndDateString 最新已完成统计的账期结束时间
 */

describe('获取目标时间点最新已完成统计的账期的起始时间', () => {
  function testGetLastestCompletedPeriodRange (
    /**
     * @param {testParamsTxt} testParams
     */
    {
      dateString,
      yearEnd,
      monthEnd,
      periodStartDateString,
      periodEndDateString
    }, prefixDesc) {
    // eslint-disable-next-line no-undef
    it(`${prefixDesc}`, () => {
      const lastestCompletedPeriodRange = getLastestCompletedPeriodRange(
        new Date(dateString),
        {
          yearEnd: yearEnd,
          monthEnd: monthEnd
        }
      )
      expect(
        dayjs(
          lastestCompletedPeriodRange.periodStartDate
        ).format('YYYY-M-D')
      ).equal(periodStartDateString)
      expect(
        dayjs(
          lastestCompletedPeriodRange.periodEndDate
        ).format('YYYY-M-D')
      ).equal(periodEndDateString)
    })
  }
  [{
    desc: '统计日期 > 月截止日期 1',
    testParams: {
      dateString: '2020-1-21',
      yearEnd: 28,
      monthEnd: 20,
      periodStartDateString: '2019-12-29',
      periodEndDateString: '2020-1-20'
    }
  }, {
    desc: '统计日期 > 月截止日期 2',
    testParams: {
      dateString: '2020-1-21',
      yearEnd: 31,
      monthEnd: 20,
      periodStartDateString: '2020-1-1',
      periodEndDateString: '2020-1-20'
    }
  }, {
    desc: '统计日期 = 月截止日期',
    testParams: {
      dateString: '2020-1-20',
      yearEnd: 28,
      monthEnd: 20,
      periodStartDateString: '2020-11-21',
      periodEndDateString: '2020-12-28'
    }
  }, {
    desc: '统计日期 < 月截止日期',
    testParams: {
      dateString: '2020-1-19',
      yearEnd: 28,
      monthEnd: 20,
      periodStartDateString: '2019-11-21',
      periodEndDateString: '2019-12-28'
    }
  }].forEach(
    ({ desc, testParams }) => testGetLastestCompletedPeriodRange(testParams, `1月 - ${desc}`)
  );

  [{
    desc: '统计日期 > 月截止日期',
    testParams: {
      dateString: '2020-5-21',
      yearEnd: 28,
      monthEnd: 20,
      periodStartDateString: '2020-4-21',
      periodEndDateString: '2020-5-20'
    }
  }, {
    desc: '统计日期 = 月截止日期',
    testParams: {
      dateString: '2020-5-20',
      yearEnd: 28,
      monthEnd: 20,
      periodStartDateString: '2020-3-21',
      periodEndDateString: '2020-4-20'
    }
  }, {
    desc: '统计日期 < 月截止日期',
    testParams: {
      dateString: '2020-5-19',
      yearEnd: 28,
      monthEnd: 20,
      periodStartDateString: '2020-3-21',
      periodEndDateString: '2020-4-20'
    }
  }].forEach(({ desc, testParams }) => testGetLastestCompletedPeriodRange(testParams, `5月 - ${desc}`));

  [{
    desc: '统计日期 > 月截止日期 1',
    testParams: {
      dateString: '2020-3-31',
      yearEnd: 28,
      monthEnd: 28,
      periodStartDateString: '2020-2-29',
      periodEndDateString: '2020-3-28'
    }
  }, {
    desc: '统计日期 > 月截止日期 2',
    testParams: {
      dateString: '2020-3-31',
      yearEnd: 28,
      monthEnd: 29,
      periodStartDateString: '2020-3-1',
      periodEndDateString: '2020-3-29'
    }
  }].forEach(({ desc, testParams }) => testGetLastestCompletedPeriodRange(testParams, `闰年 - 3月 - ${desc}`))
})
