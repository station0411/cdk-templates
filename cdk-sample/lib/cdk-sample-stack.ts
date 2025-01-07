import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

// スタック用の追加プロパティ
interface CdkSampleStackProps extends StackProps {
  stackConfig: {
    idList: string[];
    env: string;
    prefix: string;
    businessIdPairList0000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList1000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList2000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList3000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList4000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList5000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList6000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList7000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList8000: { providerBusinessId: string; consumerBusinessId: string; }[];
    businessIdPairList9000: { providerBusinessId: string; consumerBusinessId: string; }[];
  };
}

export class CdkSampleStackIAM1 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { idList } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    idList.slice(0,2).forEach((id) => {
      // IAMロールの作成
      const role = new iam.Role(this, `${prefix}-${env}-iam-role-${id}`, {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        description: "",
        externalIds: [],
        inlinePolicies: {},
        managedPolicies: [],
        maxSessionDuration: Duration.hours(1),
        path: "/",
        // permissionsBoundary: ,
        roleName: `${prefix}-${env}-iam-role-${id}`,
      });

      // IAMポリシーの作成
      new iam.ManagedPolicy(this, `${prefix}-${env}-iam-policy-${id}`, {
        description: "",
        document: iam.PolicyDocument.fromJson({
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                  "s3:*"
              ],
              "Resource": [
                `arn:aws:s3:::${prefix}-${env}-s3-*-${id}`,
                `arn:aws:s3:::${prefix}-${env}-s3-*-${id}/*`,
                `arn:aws:s3:::${prefix}-${env}-s3-${id}-*`,
                `arn:aws:s3:::${prefix}-${env}-s3-${id}-*/*`
              ]
            }
          ]
        }),
        groups: [],
        managedPolicyName: `${prefix}-${env}-iam-policy-${id}`,
        path: "/",
        roles: [role],
        // statements: [],
        users: [],
      });
    });
  }
}

export class CdkSampleStackIAM2 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { idList } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    idList.slice(2,3).forEach((id) => {
      // IAMロールの作成
      const role = new iam.Role(this, `${prefix}-${env}-iam-role-${id}`, {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        description: "",
        externalIds: [],
        inlinePolicies: {},
        managedPolicies: [],
        maxSessionDuration: Duration.hours(1),
        path: "/",
        // permissionsBoundary: ,
        roleName: `${prefix}-${env}-iam-role-${id}`,
      });

      // IAMポリシーの作成
      new iam.ManagedPolicy(this, `${prefix}-${env}-iam-policy-${id}`, {
        description: "",
        document: iam.PolicyDocument.fromJson({
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                  "s3:*"
              ],
              "Resource": [
                `arn:aws:s3:::${prefix}-${env}-s3-*-${id}`,
                `arn:aws:s3:::${prefix}-${env}-s3-*-${id}/*`,
                `arn:aws:s3:::${prefix}-${env}-s3-${id}-*`,
                `arn:aws:s3:::${prefix}-${env}-s3-${id}-*/*`
              ]
            }
          ]
        }),
        groups: [],
        managedPolicyName: `${prefix}-${env}-iam-policy-${id}`,
        path: "/",
        roles: [role],
        // statements: [],
        users: [],
      });
    });
  }
}

export class CdkSampleStackS30 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList0000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList0000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS31 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList1000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList1000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS32 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList2000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList2000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS33 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList3000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList3000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS34 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList4000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList4000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS35 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList5000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList5000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS36 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList6000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList6000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS37 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList7000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList7000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS38 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList8000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList8000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}

export class CdkSampleStackS39 extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { businessIdPairList9000 } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    businessIdPairList9000.forEach((businessIdPair) => {
      const s3Bucket = new s3.Bucket(this, `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        accessControl: s3.BucketAccessControl.PRIVATE,
        autoDeleteObjects: false,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        bucketKeyEnabled: false,
        bucketName: `${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
        cors: [],
        encryption: s3.BucketEncryption.S3_MANAGED,
        // encryptionKey: "",
        // enforceSSL: true,
        eventBridgeEnabled: false,
        intelligentTieringConfigurations: [],
        inventories: [],
        lifecycleRules: [],
        metrics: [],
        // minimumTLSVersion: 1.2,
        // notificationsHandlerRole: ,
        // notificationsSkipDestinationValidation: ,
        // objectLockDefaultRetention: ,
        objectLockEnabled: false,
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        publicReadAccess: false,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
        // serverAccessLogsBucket: ,
        // serverAccessLogsPrefix: ,
        // targetObjectKeyFormat: ,
        transferAcceleration: false,
        transitionDefaultMinimumObjectSize: s3.TransitionDefaultMinimumObjectSize.VARIES_BY_STORAGE_CLASS,
        versioned: false,
        // websiteErrorDocument: ,
        // websiteIndexDocument: ,
        // websiteRedirect: ,
        // websiteRoutingRules: ,
      });

      const s3BucketPolicy = new s3.BucketPolicy(this, `${prefix}-${env}-s3-bucket-policy-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`, {
        bucket: s3Bucket,
        removalPolicy: RemovalPolicy.DESTROY, // 本当はRemovalPolicy.RETAIN
      });

      s3BucketPolicy.document.addStatements(
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          }
        }),
        iam.PolicyStatement.fromJson({
          "Effect": "Deny",
          "Principal": {
            "AWS": "*"
          },
          "Action": "s3:*",
          "Resource": [
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}`,
            `arn:aws:s3:::${prefix}-${env}-s3-bucket-${businessIdPair.providerBusinessId}-${businessIdPair.consumerBusinessId}/*`
          ],
          "Condition": {
            "NumericLessThan": {
              "s3:TlsVersion": "1.2"
            }
          }
        })
      );
    });
  }
}
