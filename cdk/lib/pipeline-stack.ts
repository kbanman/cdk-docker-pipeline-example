import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import {GitHubSourceAction} from '@aws-cdk/aws-codepipeline-actions'
import {DevStage} from './dev-stage'

/**
 * The stack that defines the application pipeline
 */
export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const sourceArtifact = new codepipeline.Artifact('source');
        const cloudAssemblyArtifact = new codepipeline.Artifact('cloudAssembly');

        const pipeline = new CdkPipeline(this, 'Pipeline', {
            pipelineName: 'DockerPipeline',
            cloudAssemblyArtifact,

            sourceAction: new GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: SecretValue.secretsManager(this.node.tryGetContext('github-token-secret')),
                owner: this.node.tryGetContext('github-owner'),
                repo: this.node.tryGetContext('github-repo'),
                branch: this.node.tryGetContext('github-branch'),
                trigger: codepipeline_actions.GitHubTrigger.POLL,
            }),

            synthAction: SimpleSynthAction.standardNpmSynth({
                subdirectory: 'cdk',
                sourceArtifact,
                cloudAssemblyArtifact,
            }),
        });

        pipeline.addApplicationStage(new DevStage(this, 'DevStage'))
    }
}
