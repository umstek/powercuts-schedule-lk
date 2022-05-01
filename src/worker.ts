import { Hono } from 'hono';

import { getInterruptions, getAFCookie, getRVT } from './provider/ceb';
import { load, save } from './storage';

const app = new Hono();

app.get('/favicon.ico', (c) => c.notFound());

app.get('/', (c) => c.json({ date: new Date() }));

app.post('/ceb/af-cookie', async (c) => {
  const afCookie = await getAFCookie();
  await save('ceb/af-cookie', afCookie);

  return c.json({ afCookie });
});

app.post('/ceb/rvt', async (c) => {
  const rvt = await getRVT();
  await save('ceb/rvt', rvt);

  return c.json({ rvt });
});

app.get('/ceb/:acctNo', async (c) => {
  const acctNo = c.req.param('acctNo');
  const from = c.req.query('from');
  const to = c.req.query('to');

  const afCookie = await load('ceb/af-cookie', 'json');
  const rvt = await load('ceb/rvt', 'text');

  const interruptions = await getInterruptions(
    { acctNo, from, to },
    rvt,
    afCookie,
  );

  return c.json(interruptions);
});

app.fire();
