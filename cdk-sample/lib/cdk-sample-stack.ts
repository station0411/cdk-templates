import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

// スタック用の追加プロパティ
interface CdkSampleStackProps extends StackProps {
  stackConfig: {
    idList: string[];
    env: string;
    prefix: string;
  };
}

export class CdkSampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: CdkSampleStackProps) {
    super(scope, id, props);

    // props が undefined の場合を考慮
    if (!props?.stackConfig) {
      throw new Error('stackConfig is required');
    }

    const { idList } = props.stackConfig;
    const { env } = props.stackConfig;
    const { prefix } = props.stackConfig;

    // S3バケットとIAMロールの作成
    // const buckets: Record<string, s3.Bucket> = {};
    const roles: Record<string, iam.Role> = {};

    idList.forEach((id) => {
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
      roles[id] = role;

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
