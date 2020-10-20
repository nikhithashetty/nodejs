const dialogflow = require('dialogflow');
const uuid = require('uuid');
const express=require('express')
const bodyParse=require('body-parser')
const app=express()
const port=5000;
const sessionId = uuid.v4();

app.use(bodyParse.urlencoded({
    extended:false
}))
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });
app.post('/send-msg',(req,res)=>{
  console.log("Request"+req+"fin")
  console.log(req.body)
   runSample(req.body.data).then(data=>{
    
        res.send({Reply:data})
    })

})
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg,projectId = 'ft-bal-jdnxov') {
  const arr1 =[]
  console.log("A"+msg)
  // A unconsole.lique identifier for the given session
 
//console.log(aa)
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
      keyFilename:"FT-Bal-551c56a61f34.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
var arr=[]
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  var aa=responses[0].queryResult.webhookPayload
  
  const result = responses[0].queryResult;
  //console.log(result.fulfillmentMessages[2])
  for(var i=0;i<result.fulfillmentMessages.length;i++)
  {
    var x=result.fulfillmentMessages[i]
    if(x.message=="text")
    {
    arr.push(x.text.text)
    }
    
   
  }
  
  //console.log(arr)
  for(var i=0;i<result.fulfillmentMessages.length;i++)
  {
    var obj={}
 var x=result.fulfillmentMessages[i]

 obj['message']=x.message
 
 if(x.message=="text")
 {
   obj['text']=x.text.text
   
 }
 else if(x.message=="quickReplies")
 {
   obj['quickReplies']=x.quickReplies.quickReplies
   
 }
 else if(x.message=="payload")
 {
   //obj['quickReplies']=x.quickReplies.quickReplies
  for(var j=1;j<7;j++)
  {
   
    obj['url'+j+'']=x.payload.fields['url'+j+''].stringValue;
  }
  

   
 }
 arr1.push(obj)
 console.log(arr1)
     /*
    if(x.message=="text")
    {
    arr.push(x.text.text)
    }*/
  }
  
  //console.log(arr)
  //console.log(`  Query: ${result.queryText}`);
  //console.log(`  Response: ${result.fulfillmentText}`);
  /*if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }*/
  return arr1;
}

app.listen(port,()=>{
    console.log("running on port"+port)
});

