#!/usr/bin/env zx

// Uncomment for intellisense
// import 'zx/globals';

$.verbose = false;

const OUTAGE_MAP_URL = 'https://cebcare.ceb.lk/Incognito/OutageMap';
const CALENDAR_DATA_URL = 'https://cebcare.ceb.lk/Incognito/GetCalendarData';
const AF_COOKIE_REGEX =
  /(?<fkey>\.AspNetCore\.Antiforgery\.[A-Za-z0-9]+)=(?<fvalue>[^;]*);/gm;
const RVT_REGEX =
  /input name="__RequestVerificationToken".*value="(?<rvt>.*)"/gm;

const { from, to, acctNo } = argv; // minimist
if (!from || !to || !acctNo) {
  console.error(
    `Usage: ./ceb.js --from ${chalk.red('<from>')} --to ${chalk.red(
      '<to>',
    )} --acctNo ${chalk.red('<acctNo>')}`,
  );
  process.exit(1);
}

let outageMapResponse = await fetch(OUTAGE_MAP_URL);
if (!outageMapResponse.ok) {
  throw new Error(
    `${outageMapResponse.status} ${outageMapResponse.statusText}`,
  );
}

const cookies = outageMapResponse.headers.get('set-cookie');
const afCookieMatch = AF_COOKIE_REGEX.exec(cookies);
const afKey = afCookieMatch.groups.fkey;
const afValue = afCookieMatch.groups.fvalue;

const outageMapHtml = await outageMapResponse.text();
const rvt = RVT_REGEX.exec(outageMapHtml).groups.rvt;

const headers = {
  'content-type': 'json',
  cookie: `${afKey}=${afValue}`,
  requestverificationtoken: rvt,
};

let calendarResponse = await fetch(
  `${CALENDAR_DATA_URL}?from=${from}&to=${to}&acctNo=${acctNo}`,
  {
    method: 'GET',
    headers,
  },
);
if (!calendarResponse.ok) {
  throw new Error(`${calendarResponse.status} ${calendarResponse.statusText}`);
}

const calendarJson = await calendarResponse.json();
const interruptions = calendarJson.interruptions.map((i) => ({
  start: new Date(i.startTime).toLocaleString(),
  end: new Date(i.endTime).toLocaleString(),
  type: i.interruptionTypeName,
  status: i.status,
}));

console.table(interruptions);
