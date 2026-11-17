import assert from 'node:assert/strict';
import { sendContactMessage } from '../public/assets/js/contact-api.mjs';
const input = {name:'Local test',email:'test@example.invalid',body:'Local fixture only.'};
for (const body of [{ok:true,stored:true,delivery:'direct'},{ok:true,stored:true,delivery:'queued'},{ok:true}]) {
  let calls=0;
  assert.deepEqual(await sendContactMessage(input,{fetchImpl:async()=>{calls++;return {ok:true,status:200,json:async()=>body};}}),body);
  assert.equal(calls,1,'all accepted server responses are terminal; no Firestore bypass');
}
await assert.rejects(sendContactMessage(input,{fetchImpl:async()=>({ok:false,status:429,json:async()=>({ok:false})})}),e=>e.code==='gdb/rate-limited');
await assert.rejects(sendContactMessage(input,{fetchImpl:async()=>({ok:false,status:503,json:async()=>({ok:false})})}));
await assert.rejects(sendContactMessage(input,{timeoutMs:5,fetchImpl:(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted'))))}));
const requestIds = [];
const mock = (success) => async (_url, request) => {
  requestIds.push(JSON.parse(request.body).requestId);
  return {ok: success, status: success ? 202 : 503, json: async () => ({ok: success})};
};
await assert.rejects(sendContactMessage(input, {fetchImpl: mock(false)}));
await sendContactMessage(input, {fetchImpl: mock(true)});
await sendContactMessage(input, {fetchImpl: mock(true)});
assert.equal(requestIds[0], requestIds[1], 'an ambiguous retry uses the original document ID');
assert.notEqual(requestIds[1], requestIds[2], 'new submission gets a different document ID');
console.log('Contact API verified: stored/queued/honeypot terminal, rate limit, failure and timeout. No live requests.');
