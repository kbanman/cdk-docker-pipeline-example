import {CfnOutput, Construct, Stack, StackProps} from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as ecs from '@aws-cdk/aws-ecs'
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns'
import * as ecr_assets from '@aws-cdk/aws-ecr-assets'

export interface ServiceStackProps extends StackProps {
  dockerContext?: string
  dockerFile?: string
  imageAsset?: ecr_assets.DockerImageAsset
  image?: ecs.ContainerImage
}

export class ServiceStack extends Stack {
  public readonly vpc: ec2.Vpc
  public readonly url: CfnOutput
  public readonly svc: ecs_patterns.ApplicationLoadBalancedFargateService
  
  constructor(scope: Construct, id: string, props: ServiceStackProps) {
    super(scope, id, props)
    
   const image = props.image!
    const vpc = this.vpc = new ec2.Vpc(this, 'DefaultVpc', {maxAzs: 2})
    const ecsCluster = new ecs.Cluster(this, 'EcsCluster', {vpc})
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
    })
    const svc = this.svc = this.fargateService(ecsCluster, taskDef, image)
    this.url = new CfnOutput(this, 'SvcUrl', {value: svc.loadBalancer.loadBalancerDnsName})
  }
  
  private fargateService(ecsCluster: ecs.Cluster,
                         taskDef: ecs.TaskDefinition,
                         image: ecs.ContainerImage) {
    const APP_PORT = 8080
    
    const containerDef = new ecs.ContainerDefinition(this, 'ContainerDefinition', {
      image,
      taskDefinition: taskDef,
      environment: {
        PORT: `${APP_PORT}`,
      },
      logging: ecs.LogDriver.awsLogs({streamPrefix: 'app'}),
    })
    
    containerDef.addPortMappings({
      containerPort: APP_PORT,
    })
    
    return new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster: ecsCluster,
      taskDefinition: taskDef,
      desiredCount: 1,
    })
  }
}
