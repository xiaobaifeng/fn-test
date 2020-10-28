/* eslint-disable no-unexpected-multiline */
import { expect } from 'chai'

import { getLastestCompletedPeriodRange } from '@/libs/ec-utils'

const testParamsTxt = {
  dateString: '统计时间',
  yearEnd: '年截止日期',
  monthEnd: '月截止日期',
  periodStartDateString: '最新已完成统计的账期开始时间',
  periodEndDateString: '最新已完成统计的账期结束时间'
}

describe('获取目标时间点最新已完成统计的账期的起始时间', () => {
  function testGetLastestCompletedPeriodRange ({
    dateString,
    yearEnd,
    monthEnd,
    periodStartDateString,
    periodEndDateString
  }, prefixDesc) {
    // eslint-disable-next-line no-undef
    it(`${prefixDesc}\n       ${Object.keys(arguments[0]).map(key => `${testParamsTxt[key] || key}: ${arguments[0][key]},`).join('\n       ')}`, () => {
      const lastestCompletedPeriodRange = getLastestCompletedPeriodRange(
        new Date(dateString),
        {
          yearEnd: yearEnd,
          monthEnd: monthEnd
        }
      )
      expect(lastestCompletedPeriodRange.periodStartDate.toLocaleDateString()).to.equal(periodStartDateString)
      expect(lastestCompletedPeriodRange.periodEndDate.toLocaleDateString()).to.equal(periodEndDateString)
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
