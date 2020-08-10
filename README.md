CDK Docker Pipeline Example
---------------------------

Experiment using the new (developer preview) [aws-cdk pipelines](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/) feature to build and deploy a docker application.

### Layout

The CDK definition is in the `/cdk` directory, and the application is in `/src`. The CDK app has its own npm configuration to keep it separate from the application. 

### Scripts

* `npm start` - starts the expressjs server that serves as the example application.
* `npm run build` - transpiles the app into javascript - output is in the `dist` directory.
