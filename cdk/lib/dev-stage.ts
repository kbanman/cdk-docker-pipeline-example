import {CfnOutput, Construct, Stage, StageProps} from '@aws-cdk/core'
import * as ecs from '@aws-cdk/aws-ecs'
import {ServiceStack} from './service-stack'

/**
 * Deployable unit of web service app
 */
export class DevStage extends Stage {
  public readonly urlOutput: CfnOutput
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props)
    
    const image = ecs.ContainerImage.fromAsset('../', {
      buildArgs: {
        PORT: '8080',
      },
    })
    
    const service = new ServiceStack(this, 'WebService', {
      image,
    })
    
    this.urlOutput = service.url
  }
}
