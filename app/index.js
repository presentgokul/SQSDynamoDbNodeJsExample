console.log('Hello AWS')
import  { sqs, dynamodb, sqsParams, dynamoDBTableParams , insertItem} from './initializer';
var uuid = require('uuid-random');


  let readLoop = function(frequency) { 
    console.log('readloop');
		var i=0;
        while(i < frequency){
        	readDocument();
            i++;
        }
    };

    let readDocument = function(){
        sqs.receiveMessage(sqsParams, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);      
                data.Messages.forEach(function (value) {
                    const obj = JSON.parse(value.Body);
                    let dynamoPutItemParams = {
                        TableName : "daily_events_1",
                        Item:{
                            "id": uuid(), "siteid": obj.siteid, "email": obj.email, 
                            "lastevent": obj.lastevent, "eventtype": obj.eventtype, "json":value.Body
                        }
                    };
                    insertItem(dynamoPutItemParams,value);
                });
            }    
          });   
    };
   

    
    let sendMessage = function(json) { 
        console.log('sendMessage');
        var sqsSendParams = {
            QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/12345689/presentgokul',
            MessageAttributes:{
                "Title":{
                    DataType:"String",
                    StringValue:"AWS SQS"
                }
            },
            MessageBody:json
            
        }; 
        sqs.sendMessage(sqsSendParams, function(err, data) {
            if (err) console.log(err, err.stack); 
            else     console.log("Msg Sent to Queue"); 
          });
        
        };

    document.querySelector("#recievemsg").addEventListener('click', function(){
        readLoop(document.querySelector("#freqId").value);
    
    });

    document.querySelector("#sendmsg").addEventListener('click', function(){
      var jsonStr ='{"siteid":"'+document.querySelector("#siteID").value+'","emailID":"'+document.querySelector("#emailID").value+'","lastevent":"'+document.querySelector("#lastEvent").value+'","eventtype":"'+document.querySelector("#eventType").value+'"}'
      sendMessage(jsonStr);    
    
    });
//readLoop(1);

                   

              
 
     


