const OUTAGE_MAP_URL = 'https://cebcare.ceb.lk/Incognito/OutageMap';
const CALENDAR_DATA_URL = 'https://cebcare.ceb.lk/Incognito/GetCalendarData';
const AF_COOKIE_REGEX = /(\.AspNetCore\.Antiforgery\.[A-Za-z0-9]+)=([^;]*);/gm;
const RVT_REGEX = /input name="__RequestVerificationToken".*value="(.*)"/gm;

export async function getAFCookie() {
  let outageMapResponse = await fetch(OUTAGE_MAP_URL, { method: 'HEAD' });
  if (!outageMapResponse.ok) {
    throw new Error(
      `${outageMapResponse.status} ${outageMapResponse.statusText}`,
    );
  }

  const cookies = outageMapResponse.headers.get('set-cookie');

  const afCookieMatch = AF_COOKIE_REGEX.exec(cookies);
  const afKey = afCookieMatch[1];
  const afValue = afCookieMatch[2];

  return {
    afKey,
    afValue,
  };
}

export async function getRVT() {
  console.log('Getting RVT...');
  
  let outageMapResponse = await fetch(OUTAGE_MAP_URL);
  console.log('Got page');
  
  if (!outageMapResponse.ok) {
    throw new Error(
      `${outageMapResponse.status} ${outageMapResponse.statusText}`,
    );
  }

  const outageMapHtml = await outageMapResponse.text();
  const rvt = RVT_REGEX.exec(outageMapHtml)[1];
  console.log('Got RVT');

  return rvt;
}

interface CEBAPIArgs {
  acctNo: string;
  from: string;
  to: string;
}

export async function getInterruptions(
  { acctNo, from, to }: CEBAPIArgs,
  rvt: string,
  { afKey, afValue }: { afKey: string; afValue: string },
) {
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
    throw new Error(
      `${calendarResponse.status} ${calendarResponse.statusText}`,
    );
  }

  const calendarJson: any = await calendarResponse.json();
  const interruptions = calendarJson.interruptions
    .map((i) => ({
      start: new Date(i.startTime),
      end: new Date(i.endTime),
      type: i.interruptionTypeName,
      status: i.status,
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  return interruptions;
}
