#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkSampleStack } from '../lib/cdk-sample-stack';

const app = new cdk.App();
new CdkSampleStack(app, 'CdkSampleStack', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});