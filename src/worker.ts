import { Hono } from 'hono';

import { find } from './provider/ceb';

const app = new Hono();

app.get('/favicon.ico', (c) => c.notFound());

// app.post('/ceb/af-cookie', (c) => {});
// app.post('/ceb/rvt', (c) => {});
// app.get('/ceb/:acctNo', async (c) => {
//   const acctNo = c.req.param('acctNo');
//   const from = c.req.query('from');
//   const to = c.req.query('to');

//   const interruptions = await find({
//     acctNo,
//     from,
//     to,
//   });

//   return c.json(interruptions);
// });

app.fire();
