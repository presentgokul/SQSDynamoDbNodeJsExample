var AWS = require("aws-sdk");
AWS.config = new AWS.Config();
 AWS.config.accessKeyId = "AKIA2ML7HMCXFDKAPDYP";
 AWS.config.secretAccessKey = "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";
 AWS.config.region ="eu-west-1";
 
var dynamodb = new AWS.DynamoDB.DocumentClient();

var sqs = new AWS.SQS();
var sqsParams = {
    QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/713768263854/voyager-daily-events-queue',
    VisibilityTimeout: '10',
    WaitTimeSeconds: '10'
};

var dynamoDBTableParams = {
    TableName : "daily_events_1",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"} //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "id", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

let insertItem = function(params,value){
    var myPromise = new Promise((resolve, reject) => {
        dynamodb.put(params, function(err, data) {
            if (err) {
                reject("Unable to insert");
            } else {
                resolve('PutItem succeeded:');     
            }
         });

    })

    myPromise.then((resolvedValue) => {
        console.log(resolvedValue);
        var deleteMsgParam = {
            QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/713768263854/voyager-daily-events-queue',
            ReceiptHandle:  value.ReceiptHandle 
          };
          sqs.deleteMessage(deleteMsgParam, function(err, data) {
            if (err) console.log(err, err.stack); 
            else     console.log("Msg Cleared from Queue"); 
          });
    }, (error) => {
        console.log(error);
    });
};

export { sqs, dynamodb, sqsParams, dynamoDBTableParams, insertItem };