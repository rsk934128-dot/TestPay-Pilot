'use client';

/** Defines the context for a security rule violation. */
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/** Custom error for Firestore permission issues. */
export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;
  public readonly name = 'FirestorePermissionError';

  constructor(context: SecurityRuleContext) {
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify({
  context: {
    path: context.path,
    method: context.operation,
    resource: context.requestResourceData,
  },
}, null, 2)}`;

    super(message);
    this.context = context;
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
