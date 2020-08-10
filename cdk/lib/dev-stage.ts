import {CfnOutput, Construct, Stage, StageProps} from '@aws-cdk/core'
import {ServiceStack} from './service-stack'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecr from '@aws-cdk/aws-ecr'
import * as ecr_assets from '@aws-cdk/aws-ecr-assets'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import {DockerImageAsset} from '@aws-cdk/aws-ecr-assets'

/**
 * Deployable unit of web service app
 */
export class DevStage extends Stage {
    public readonly urlOutput: CfnOutput;

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const image = ecs.ContainerImage.fromAsset('../',  {
            buildArgs: {
                PORT: '8080',
            }
        })

        const service = new ServiceStack(this, 'WebService', {
            image,
        });
        
        this.urlOutput = service.url
    }
}
