const { EventHubConsumerClient, earliestEventPosition } = require("@azure/event-hubs");

async function main() {
  const client = new EventHubConsumerClient(
    "[event hub name]",
    "Endpoint=sb://[event hub name].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[shared access key]",
    "imageaddition"
  );

  // In this sample, we use the position of earliest available event to start from
  // Other common options to configure would be `maxBatchSize` and `maxWaitTimeInSeconds`
  const subscriptionOptions = {
    startPosition: earliestEventPosition
  };

  const subscription = client.subscribe(
    {
      processEvents: async(events, context) => {
        console.log(`success`);
      },
      processError: async(err, context) => {
        console.log(`error`);
      }
    },
    subscriptionOptions
  );

  // Wait for a few seconds to receive events before closing
  setTimeout(async () => {
    await subscription.close();
    await client.close();
    console.log(`Exiting sample`);
  }, 600 * 1000);
}

main();