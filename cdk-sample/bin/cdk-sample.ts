#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkSampleStackIAM1, CdkSampleStackIAM2, 
  CdkSampleStackS30, CdkSampleStackS31, CdkSampleStackS32, CdkSampleStackS33, CdkSampleStackS34,
  CdkSampleStackS35, CdkSampleStackS36, CdkSampleStackS37, CdkSampleStackS38, CdkSampleStackS39 } from '../lib/cdk-sample-stack';

const app = new cdk.App();
// new CdkSampleStackIAM1(app, 'CdkSampleStackIAM1', {
//   stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
// });

// new CdkSampleStackIAM2(app, 'CdkSampleStackIAM2', {
//   stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
// });

new CdkSampleStackS30(app, 'CdkSampleStackS30', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS31(app, 'CdkSampleStackS31', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS32(app, 'CdkSampleStackS32', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS33(app, 'CdkSampleStackS33', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS34(app, 'CdkSampleStackS34', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS35(app, 'CdkSampleStackS35', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS36(app, 'CdkSampleStackS36', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS37(app, 'CdkSampleStackS37', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS38(app, 'CdkSampleStackS38', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});

new CdkSampleStackS39(app, 'CdkSampleStackS39', {
  stackConfig: require(`../config/${process.env.ENV || 'dev'}`).default // 環境設定をスタックに渡す
});
