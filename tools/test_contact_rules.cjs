const {createRequire}=require('node:module');
const {readFileSync}=require('node:fs');
const {resolve}=require('node:path');
const deps=createRequire(process.env.AUDIT_NODE_PACKAGE || resolve('package.json'));
const {initializeTestEnvironment,assertFails,assertSucceeds}=deps('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,getDocs,collection,updateDoc,deleteDoc,Timestamp}=deps('firebase/firestore');
(async()=>{
  if(!process.env.FIRESTORE_EMULATOR_HOST?.startsWith('127.0.0.1:')) throw new Error('Local emulator required');
  const env=await initializeTestEnvironment({projectId:'demo-qwizzy-audit',firestore:{rules:readFileSync('firestore.rules','utf8')}});
  try{
    const data={name:'Local fixture',email:'local@example.invalid',subject:'General',body:'Local test message.',createdAt:Timestamp.now(),handled:false};
    await env.withSecurityRulesDisabled(async c=>setDoc(doc(c.firestore(),'messages','existing'),data));
    const publicDb=env.unauthenticatedContext().firestore();
    const other=env.authenticatedContext('other',{email:'other@example.invalid',email_verified:true}).firestore();
    const unverified=env.authenticatedContext('unverified',{email:'generisdatabase@gmail.com',email_verified:false}).firestore();
    const admin=env.authenticatedContext('admin',{email:'generisdatabase@gmail.com',email_verified:true}).firestore();
    for(const db of [publicDb,other,unverified]){
      await assertFails(getDoc(doc(db,'messages','existing')));
      await assertFails(getDocs(collection(db,'messages')));
      await assertFails(setDoc(doc(db,'messages','new'),data));
      await assertFails(updateDoc(doc(db,'messages','existing'),{handled:true}));
      await assertFails(deleteDoc(doc(db,'messages','existing')));
    }
    await assertSucceeds(getDocs(collection(admin,'messages')));
    await assertSucceeds(updateDoc(doc(admin,'messages','existing'),{handled:true}));
    for(const patch of [{body:'hijack'}, {name:'x'.repeat(10000)}, {createdAt:Timestamp.now()}, {extra:'pollution'}, {handled:'yes'}]){
      await assertFails(updateDoc(doc(admin,'messages','existing'),patch));
    }
    await assertFails(setDoc(doc(admin,'messages','client-created'),data));
    await assertFails(getDoc(doc(publicDb,'other','private')));
    await assertSucceeds(deleteDoc(doc(admin,'messages','existing')));
    console.log('PASS: public/foreign/unverified reads and writes denied; verified admin can list, toggle handled and delete; content/timestamp/type/schema changes denied.');
  }finally{await env.cleanup();}
})().catch(e=>{console.error(e);process.exitCode=1;});
